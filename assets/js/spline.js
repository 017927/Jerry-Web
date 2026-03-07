import { Application } from 'https://unpkg.com/@splinetool/runtime';

function initSpline() {
  const canvas = document.getElementById('canvas3d');
  if (!canvas) return false;

  const app = new Application(canvas);
  app.load('https://prod.spline.design/s8mFNdXKjCBGG-wI/scene.splinecode');
  return true;
}

if (!initSpline()) {
  const interval = setInterval(() => {
    if (initSpline()) clearInterval(interval);
  }, 100);
}
