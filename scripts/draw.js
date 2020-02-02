function waitImage(src) {
    return new Promise((resolve, reject) => {
      let img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }
  drawIsland = async (scale = 1, file, ctx) => {
    if (!file) document.write(`<p>Error reading save!<p>`)
    island = file.island
    let errs = 0
    let tot = 0
    //ctx.fillStyle = "#FF0000";
    //ctx.fillRect(0, 0, 150, 75);
    const promises = [];
    let time = Date.now();
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 12; j++) {
        if (island.block[i][j]) {
          let name;
          name = island.block[i][j].split("|")[0];
          if (name) {
            tot += 1
            try {
              let url = `${require('electron').remote.getGlobal('loaded').data}\\sprites\\${name}.png`
              let image
            //   if (!cache[name]) {
                image = await waitImage(url)
                draw(image, i * 16 * scale, j * 16 * scale, scale, ctx)

            //     cache[name] = image;
            //   }
            //   else {
                // image = cache[name]
                // if (image == 'error') return errs+= 1
                // draw(image, i * 16 * scale, j * 16 * scale, scale, ctx);
            //   }
            } catch (e) {
              console.log(`Can't load image: ${name}`,e);
            //   cache[name] = 'error'
              errs += 1
              document.getElementById("info").innerText =  `There were ${errs} error(s) while loading this iisland. Please make sure you download the sprites in the settings.`
            }
          }
        }
        if (island.attachment[i][j]) {
          let name;
          name = island.attachment[i][j].split("|")[0];
          if (name) {
            tot += 1
            try {
              let url = `${require('electron').remote.getGlobal('loaded').data}\\sprites\\${name}.png`
              let image
              if (!cache[name]) {
                image = await waitImage(url)
                draw(image, i * 16 * scale, j * 16 * scale, scale, ctx)

                cache[name] = image;
              }
              else {
                image = cache[name]
                if (image == 'error') return errs += 1
                draw(image, i * 16 * scale, j * 16 * scale, scale, ctx);
              }
            } catch (e) {
              console.log(`Can't load image: ${name}`);
              cache[name] = 'error'
              errs += 1
              document.getElementById("info").innerText =  `There were ${errs} error(s) while loading this iisland. Please make sure you download the sprites in the settings.`
            }
          }
        }
      }
    }
  }

  draw = (img, ax, ay, scale, ctx) => {
    var offtx = document.createElement('canvas').getContext('2d');
    if (scale <= 1) return ctx.drawImage(img, ax, ay, img.width*scale, img.height*scale)
    offtx.drawImage(img, 0, 0);
    var imgData = offtx.getImageData(0, 0, img.width, img.height).data;

    // Draw the scaled-up pixels to a different canvas context
    for (var x = 0; x < img.width; ++x) {
      for (var y = 0; y < img.height; ++y) {
        // Find the starting index in the one-dimensional image data
        var i = (y * img.width + x) * 4;
        var r = imgData[i];
        var g = imgData[i + 1];
        var b = imgData[i + 2];
        var a = imgData[i + 3];
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
        ctx.fillRect(ax + x * scale, ay + y * scale, scale, scale);
      }
    }
  }

  save = async (scale = 1, file) => {
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext("2d");
    await drawIsland(scale, file, ctx)
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href=image; // it will save locally
  }