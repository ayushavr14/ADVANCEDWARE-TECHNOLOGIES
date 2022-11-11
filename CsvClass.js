const fs = require("fs");
const csv = require("fast-csv");

class CsvFile {
  static write(filestream, rows, options) {
    return new Promise((res, rej) => {
      csv
        .writeToStream(filestream, rows, options)
        .on("error", (err) => rej(err))
        .on("finish", () => res());
    });
  }

  constructor(opts) {
    this.headers = opts.headers;
    this.path = opts.path;
    this.writeOpts = { headers: this.headers, includeEndRowDelimiter: true };
  }

  create(rows) {
    return CsvFile.write(fs.createWriteStream(this.path), rows, {
      ...this.writeOpts,
    });
  }

  append(rows) {
    return CsvFile.write(
      fs.createWriteStream(this.path, { flags: "a" }),
      rows,
      {
        ...this.writeOpts,
        writeHeaders: false,
      }
    );
  }

  read() {
    const options = {
      objectMode: true,
      delimeter: true,
      headers: true,
      renameHeaders: false,
    };
    const readableStream = fs.createReadStream(this.path);

    return csv.parseStream(readableStream, options);
  }
}

module.exports = CsvFile;
