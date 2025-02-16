import chokidar from 'chokidar';
import path from 'path'
import upload from 'greybel-js/out/upload.js'
import { logger } from 'greybel-js/out/helper/logger.js'
import fs from 'fs'

const __dirname = import.meta.dirname
const rootDir = path.join(__dirname, "root")

// Greybel currently works differently if we are uploading a dir or a file.
const getTargetDir = (filepath: string): string => {
    const isUploadingDir = fs.lstatSync(filepath).isDirectory()
    if (isUploadingDir) return '/'

    const parsedPath = path.parse(filepath);
    const filepathParent = parsedPath.dir
    const relativePath = path.relative(__dirname, filepathParent)
    const relativePathUnix = relativePath.replace(/\\/g, '/'); // If using windows, convert to unix path.

    return relativePathUnix
}

const uploadToGame = async (filepath: string) => {
    const isUploadingDir = fs.lstatSync(filepath).isDirectory()

    const success = await upload(filepath, {
        ingameDirectory: getTargetDir(filepath),
        createIngameAgentType: 'message-hook',
    });
    const dirOrFileStr = isUploadingDir ? "dir" : "file"
    if (!success) console.error(`Failed to upload the ${dirOrFileStr} ${filepath}.`)
    else console.log(`Successfully uploaded the ${dirOrFileStr} ${filepath}.`)
}

const actionQueue: Array<() => Promise<void>> = []
let currentPromise: Promise<void> | undefined = undefined

const updateQueue = () => {
    if (!currentPromise) {
        currentPromise = actionQueue.shift()?.()
        currentPromise?.then(() => {
            currentPromise = undefined
            updateQueue()
        })
    }
}

const addUploadToQueue = (path: string) => {
    console.log(`File ${path} has been changed/added. Uploading...`)
    actionQueue.push(async () => {
        uploadToGame(path)
    })
    updateQueue()
}


const main = async (): Promise<void> => {
    logger.setLogLevel('warn')
    const pathToWatch = rootDir

    console.log("Uploading all the files...")
    addUploadToQueue(pathToWatch)

    // Initialize watcher.
    const watcher = chokidar.watch(pathToWatch, {
        ignoreInitial: true, // Don't individually call for each file on start.
        // ignored: (path) => !path.endsWith('.src'), // only watch js files
        persistent: true
    });

    // Add event listeners.
    watcher
        .on('add', path => addUploadToQueue(path))
        .on('change', path => addUploadToQueue(path))
    // .on('unlink', path => console.log(`File ${path} has been removed`));

    console.log(`Watching the path ${pathToWatch}.`)

    return new Promise(() => null)
}

await main()
