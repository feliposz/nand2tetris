# Project 8

A VM code translator for the Hack computer in javascript.

## Requirements

- Node.js

## Command line usage

### Single file

Translate single file and add bootstrap code and alternative function call:

```
node vmtranslator path/to/filename.vm [y] [f]
```

Translate single file and without bootstrap code:

```
node vmtranslator path/to/filename.vm n
```

> Translated assembly code is written to `path/to/filename.asm`.

### Directory

Translate multiple files in a directory and add bootstrap code and alternative function call:

```
node vmtranslator path/to/directoryName [y] [f]
```

Translate multiple files in a directory without bootstrap code:

```
node vmtranslator path/to/directoryName n
```

> Translated assembly code is written to `path/to/directoryName/directoryName.asm`.

## Running tests

```
vmtest.bat
```
