Object.defineProperty(Array.prototype, "random", {
    value: function() {
      return this[Math.floor(Math.random() * this.length)];
    }
  });
  Object.defineProperty(String.prototype, "toProperCase", {
    value: function() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }
  });
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error(err);
  });
  process.on("unhandledRejection", err => {
    console.error(err);
  });
