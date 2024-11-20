window.addEventListener('load', () => {
  Swal.fire({
    title: 'Do you want to play music in the background?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#CBD45E',
    cancelButtonColor: '#FF6666',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector('.mySong').play();
    } else {
      document.querySelector('.mySong').pause();
      document.querySelector('.mySong').currentTime = 0;
      alert(
        'You’ve chosen not to play music. If you wish to enable it, please refresh the page.',
      );
    }
    document.querySelector('.content').style.display = 'flex';
  });
});

let highestZ = 1;

class Paper {
  constructor(paper) {
    this.paper = paper;
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;

    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  init() {
    if (this.isMobile) {
      this.attachTouchListeners();
    } else {
      this.attachMouseListeners();
    }
  }

  // Shared transformation logic
  updateTransform() {
    this.paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
  }

  // Attach touch event listeners (for mobile)
  attachTouchListeners() {
    this.paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      this.paper.style.zIndex = highestZ++;
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      this.velX = clientX - this.prevX;
      this.velY = clientY - this.prevY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      this.prevX = clientX;
      this.prevY = clientY;

      this.updateTransform();
    });

    document.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For rotation using gesture
    this.paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    this.paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }

  // Attach mouse event listeners (for desktop)
  attachMouseListeners() {
    this.paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      this.paper.style.zIndex = highestZ++;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;

      if (e.button === 2) {
        this.rotating = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.holdingPaper) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      this.velX = clientX - this.prevX;
      this.velY = clientY - this.prevY;

      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;
      this.prevX = clientX;
      this.prevY = clientY;

      this.updateTransform();
    });

    document.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Initialize for all papers
document.addEventListener('DOMContentLoaded', () => {
  const papers = Array.from(document.querySelectorAll('.paper'));
  papers.forEach((paperElement) => {
    const paper = new Paper(paperElement);
    paper.init();
  });
});
