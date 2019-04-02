`memdump` is a tool that can help us dump the heap at the nodejs server when the memory has leaked.

#### Usage

```
npm i memdump
```

#### Options

```
const options = {
  path: './heapsnapshot', // the heapdump file will be saved directory path
  type: 'all', // set the custom directory in the `path` , such as final path is './heapsnapshot/all-123', 123 is process.id
  initLog: true, // if it is true , we will save heapdump file at the moment
  cb: null, // fire callback when leak event had been triggered
  maxCount: 3, // exist max count in the directory
  maxSize: 10 // 10M, if the files have more than 10M, the earlier files will be removed but we keep the maxCount number of files
};
```

#### example

```
const memDump = new MemDump({ type: 'test', maxSize: 3 });
memDump.start();
```

