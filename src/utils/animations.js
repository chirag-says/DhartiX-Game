// Animation utility functions

// Fade in animation
export const fadeIn = (element, duration = 300) => {
  element.style.opacity = 0;
  element.style.display = "block";

  let start = null;

  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    element.style.opacity = Math.min(progress / duration, 1);

    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  };

  window.requestAnimationFrame(animate);
};

// Slide in animation
export const slideIn = (element, direction = "right", duration = 300) => {
  element.style.display = "block";

  let start = null;
  const startPosition = direction === "right" ? -100 : 100;
  element.style.transform = `translateX(${startPosition}%)`;

  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentComplete = Math.min(progress / duration, 1);

    const currentPosition =
      startPosition + 100 * percentComplete * (direction === "right" ? 1 : -1);
    element.style.transform = `translateX(${currentPosition}%)`;

    if (progress < duration) {
      window.requestAnimationFrame(animate);
    }
  };

  window.requestAnimationFrame(animate);
};

// Pulse animation
export const pulse = (element, duration = 1000) => {
  let start = null;

  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentComplete = (progress % duration) / duration;

    const scale = 1 + 0.1 * Math.sin(percentComplete * Math.PI * 2);
    element.style.transform = `scale(${scale})`;

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(animate);
};

// Shake animation
export const shake = (element, duration = 500) => {
  let start = null;

  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;

    if (progress < duration) {
      const shakeAmount = 10 * Math.sin(progress * 0.05);
      element.style.transform = `translateX(${shakeAmount}px)`;
      window.requestAnimationFrame(animate);
    } else {
      element.style.transform = "";
    }
  };

  window.requestAnimationFrame(animate);
};

// Bounce animation
export const bounce = (element, duration = 1000) => {
  let start = null;

  const animate = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percentComplete = Math.min(progress / duration, 1);

    const bounceHeight =
      -100 * Math.abs(Math.sin(percentComplete * Math.PI * 2));
    element.style.transform = `translateY(${bounceHeight}px)`;

    if (progress < duration) {
      window.requestAnimationFrame(animate);
    } else {
      element.style.transform = "";
    }
  };

  window.requestAnimationFrame(animate);
};
