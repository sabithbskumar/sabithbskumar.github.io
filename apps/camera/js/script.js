export default function camera(element) {
  const viewFinder = element.getElementsByClassName("camera-view")[0];
  const capture = element.getElementsByClassName("camera-capture")[0];

  window.navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      viewFinder.srcObject = stream;
      viewFinder.onloadedmetadata = (e) => {
        viewFinder.play();
      };
    })
    .catch( () => {
      alert("You need to give camera permissions to use this app");
    });
  capture.onclick = () => viewFinder.pause();
}

