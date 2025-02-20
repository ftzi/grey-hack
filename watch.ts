import chokidar from 'chokidar';
import path from 'path'
import upload from 'greybel-js/out/upload.js'
import { logger as greybelLogger } from 'greybel-js/out/helper/logger.js'
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
    });
    const dirOrFileStr = isUploadingDir ? "dir" : "file"
    if (!success) console.error(`Failed to upload the ${dirOrFileStr} ${filepath}.`)
    else console.log(`Successfully uploaded the ${dirOrFileStr} ${filepath}.`)
}

const uploadQueue: Array<string> = []
let currentlyUploading: string | undefined = undefined

const updateQueue = () => {
    if (currentlyUploading) return

    currentlyUploading = uploadQueue.shift()
    if (currentlyUploading) {
        uploadToGame(currentlyUploading).then(() => {
            currentlyUploading = undefined
            updateQueue()
        })
    }
}

const addUploadToQueue = (path: string) => {
    if (!uploadQueue.includes(path)) {
        uploadQueue.push(path)
        updateQueue()
    }
}

const main = async (): Promise<void> => {
    console.clear()
    const originalConsoleLog = console.log
    console.log = (...data) => {
        if (typeof data[0] === 'string' && data[0].startsWith('Trying to connect to'))
            return
        else originalConsoleLog(...data)
    }
    greybelLogger.setLogLevel('warn') // Hide most of greybel's logs

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
        .on('add', path => {
            console.log(`File ${path} has been added. Uploading...`)
            addUploadToQueue(path)
        })
        .on('change', path => {
            console.log(`File ${path} has been changed. Uploading...`)
            addUploadToQueue(path);
        })
    // .on('unlink', path => console.log(`File ${path} has been removed`));

    console.log(`Watching the path ${pathToWatch}.`)

    return new Promise(() => null)
}

await main()
