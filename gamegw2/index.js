const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1350
canvas.height = 612

const scaledCanvas = {
  width: canvas.width / 4,
  height: canvas.height / 4,
}

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
  floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      collisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
        })
      )
    }
  })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
  platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 202) {
      platformCollisionBlocks.push(
        new CollisionBlock({
          position: {
            x: x * 16,
            y: y * 16,
          },
          height: 4,
        })
      )
    }
  })
})

const gravity = 0.1

const player = new Player({
  position: {
    x: 100,
    y: 300,
  },
  collisionBlocks,
  platformCollisionBlocks,
  imageSrc: './img/warrior/Idle.png',
  frameRate: 8,
  animations: {
    Idle: {
      imageSrc: './img/warrior/vi1.png',
      frameRate: 18,
      frameBuffer: 3,
    },
    Run: {
      imageSrc: './img/warrior/v1.png',
      frameRate: 12,
      frameBuffer: 5,
    },
    Jump: {
      imageSrc: './img/warrior/v1l.png',
      frameRate: 6,
      frameBuffer: 3,
    },
    Fall: {
      imageSrc: './img/warrior/vf1.png',
      frameRate: 6,
      frameBuffer: 3,
    },
    FallLeft: {
      imageSrc: './img/warrior/vf1kiri.png',
      frameRate: 6,
      frameBuffer: 3,
    },
    RunLeft: {
      imageSrc: './img/warrior/v1kiri.png',
      frameRate: 12,
      frameBuffer: 5,
    },
    IdleLeft: {
      imageSrc: './img/warrior/vi1kiri.png',
      frameRate: 18,
      frameBuffer: 3,
    },
    JumpLeft: {
      imageSrc: './img/warrior/v1lk.png',
      frameRate: 6,
      frameBuffer: 3,
    },
  },
  canJump: true, // Tambahkan properti canJump
})

const keys = {
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  space: {
    pressed: false, // Menambahkan key untuk space
  }
}

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/ror.png',
})

const backgroundImageHeight = 432

const camera = {
  position: {
    x: 0,
    y: -backgroundImageHeight + scaledCanvas.height,
  },
}

// Kelas untuk Item yang bisa diambil
class Item {
  constructor({ position, imageSrc }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.width = 50 // lebar item
    this.height = 32 // tinggi item
    this.collected = false // apakah item sudah diambil
  }

  draw() {
    if (!this.collected) {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
  }

  collect(player) {
    // Jika pemain bertabrakan dengan item dan tombol space ditekan
    if (
      player.position.x + player.width > this.position.x &&
      player.position.x < this.position.x + this.width &&
      player.position.y + player.height > this.position.y &&
      player.position.y < this.position.y + this.height &&
      keys.space.pressed // Menunggu tombol space ditekan
    ) {
      this.collected = true // item sudah diambil
      // Lakukan sesuatu jika item diambil, seperti menambah skor
      console.log("Item collected!");
      keys.space.pressed = false; // Reset tombol space setelah item diambil
    }
  }
}

// Menambahkan 4 item ke dalam game
const items = [
  new Item({ position: { x: -5, y: 215 }, imageSrc: './img/warrior/33.png' }),  // Item pertama
  new Item({ position: { x: 531, y: 35 }, imageSrc: './img/warrior/34.png' }),  // Item kedua
  new Item({ position: { x: 134, y: 23 }, imageSrc: './img/warrior/35.png' }),  // Item ketiga
  new Item({ position: { x: 531, y: 260 }, imageSrc: './img/warrior/36.png' })   // Item keempat
]

// Kelas untuk Portal
class Portal {
  constructor({ position, imageSrc }) {
    this.position = position
    this.image = new Image()
    this.image.src = imageSrc
    this.width = 64
    this.height = 98
    this.active = false // Portal belum aktif
  }

  draw() {
    if (this.active) {
      c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
  }

  // Cek apakah pemain bertabrakan dengan portal
  checkCollision(player) {
    if (
      player.position.x + player.width > this.position.x &&
      player.position.x < this.position.x + this.width &&
      player.position.y + player.height > this.position.y &&
      player.position.y < this.position.y + this.height
    ) {
      // Pindahkan pemain ke stage berikutnya
      console.log("Portal Entered! Level Completed.");
      nextLevel();
    }
  }
}

// Menambahkan portal ke dalam game
const portal = new Portal({ position: { x: 30, y: 300 }, imageSrc: './img/warrior/portal.png' })

// Fungsi untuk pindah ke level berikutnya
function nextLevel() {
  console.log("Portal Entered! Moving to next stage...");

  // Pindah ke halaman baru (stage 2)
  window.location.href = "../gamegw3/index.html";  // Mengarahkan ke halaman stage baru
}

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  c.save()
  c.scale(4, 4)
  c.translate(camera.position.x, camera.position.y)
  background.update()
  collisionBlocks.forEach((collisionBlock) => {
    collisionBlock.update()
  })
  platformCollisionBlocks.forEach((block) => {
    block.update()
  })

  player.checkForHorizontalCanvasCollision()
  player.update()

  // Cek apakah pemain bertabrakan dengan item dan menekan tombol space
  items.forEach((item) => {
    item.collect(player)
    item.draw() // Gambar item di layar
  })

  // Jika semua item terambil, aktifkan portal
  if (items.every(item => item.collected)) {
    portal.active = true // Aktifkan portal jika semua item sudah terambil
  }

  // Gambar dan cek tabrakan dengan portal hanya jika portal aktif
  if (portal.active) {
    portal.draw()
    portal.checkCollision(player)
  }

  if (player.velocity.y === 0) {
    player.canJump = true // Reset canJump ketika menyentuh tanah
  }

  player.velocity.x = 0
  if (keys.d.pressed) {
    player.switchSprite('Run')
    player.velocity.x = 2
    player.lastDirection = 'right'
    player.shouldPanCameraToTheLeft({ canvas, camera })
  } else if (keys.a.pressed) {
    player.switchSprite('RunLeft')
    player.velocity.x = -2
    player.lastDirection = 'left'
    player.shouldPanCameraToTheRight({ canvas, camera })
  } else if (player.velocity.y === 0) {
    if (player.lastDirection === 'right') player.switchSprite('Idle')
    else player.switchSprite('IdleLeft')
  }

  if (player.velocity.y < 0) {
    player.shouldPanCameraDown({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Jump')
    else player.switchSprite('JumpLeft')
  } else if (player.velocity.y > 0) {
    player.shouldPanCameraUp({ camera, canvas })
    if (player.lastDirection === 'right') player.switchSprite('Fall')
    else player.switchSprite('FallLeft')
  }

  c.restore()
}

animate()

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      break
    case 'a':
      keys.a.pressed = true
      break
    case 'w':
      if (player.canJump) {
        player.velocity.y = -4
        player.canJump = false // Cegah lompat terus-menerus
      }
      break
    case ' ':
      keys.space.pressed = true // Menambahkan aksi saat tombol space ditekan
      break
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case ' ':
      keys.space.pressed = false // Mengatur tombol space kembali ke false setelah dilepaskan
      break
  }
})
