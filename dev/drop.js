
document.body.onload =function () {
    let dropzone = document.createElement('div')
    dropzone.id = 'dropzone'
    dropzone.style = "visibility:hidden; opacity:0"
    document.body.append(dropzone)
  
          dropzone.ondragover = () => {
              return false;
          };
  
          dropzone.ondragleave = () => {
              return false;
          };
  
          dropzone.ondragend = () => {
              return false;
          };
  
          dropzone.ondrop = (e) => {
              e.preventDefault();
              dropzone.style.visibility = "hidden";
              dropzone.style.opacity = 0;
              for (let f of e.dataTransfer.files) {
                  console.log(f)
              }
              
              return false;
          };
      
      var lastTarget = null
      window.addEventListener("dragenter", function(e)
{
    lastTarget = e.target; // cache the last target here
    // unhide our dropzone overlay
    dropzone.style.visibility = "";
    dropzone.style.opacity = 1;
});

window.addEventListener("dragleave", function(e)
{
    // this is the magic part. when leaving the window,
    // e.target happens to be exactly what we want: what we cached
    // at the start, the dropzone we dragged into.
    // so..if dragleave target matches our cache, we hide the dropzone.
    // `e.target === document` is a workaround for Firefox 57
    if(e.target === lastTarget)
    {
      dropzone.style.visibility = "hidden";
      dropzone.style.opacity = 0;
    }
});}