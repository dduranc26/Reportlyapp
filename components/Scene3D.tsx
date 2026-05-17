'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene + Camera ───────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 8)

    // ── Mouse tracking ───────────────────────────────────────
    const mouse  = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Floating triangles ───────────────────────────────────
  const triangles: {
  mesh:    THREE.Mesh | THREE.LineLoop
      speed:   THREE.Vector3
      rotSpd:  THREE.Vector3
      basePos: THREE.Vector3
    }[] = []

    const goldColor  = new THREE.Color('#C4A35A')
    const darkColor  = new THREE.Color('#1A1810')
    const warmColor  = new THREE.Color('#8B6914')

    const colors  = [goldColor, darkColor, warmColor]
    const N = 22

    for (let i = 0; i < N; i++) {
      const size = Math.random() * 0.6 + 0.15
      const geo  = new THREE.BufferGeometry()

      // Equilateral triangle vertices
      const h = size * Math.sqrt(3) / 2
      const verts = new Float32Array([
         0,        size * 0.67,  0,
        -size / 2, -h * 0.33,   0,
         size / 2, -h * 0.33,   0,
      ])
      geo.setAttribute('position', new THREE.BufferAttribute(verts, 3))
      geo.computeVertexNormals()

      const col  = colors[Math.floor(Math.random() * colors.length)]
      const wire = Math.random() > 0.45

      const mat = wire
        ? new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: Math.random() * 0.3 + 0.08 })
        : new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: Math.random() * 0.12 + 0.04, side: THREE.DoubleSide })

      const mesh = wire
        ? new THREE.LineLoop(geo, mat as THREE.LineBasicMaterial)
        : new THREE.Mesh(geo, mat as THREE.MeshBasicMaterial)

      const px = (Math.random() - 0.5) * 14
      const py = (Math.random() - 0.5) * 10
      const pz = (Math.random() - 0.5) * 6 - 2

      mesh.position.set(px, py, pz)
      mesh.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )

      scene.add(mesh)
      triangles.push({
        mesh,
        speed:   new THREE.Vector3((Math.random()-0.5)*0.003, (Math.random()-0.5)*0.002, 0),
        rotSpd:  new THREE.Vector3((Math.random()-0.5)*0.004, (Math.random()-0.5)*0.004, (Math.random()-0.5)*0.003),
        basePos: new THREE.Vector3(px, py, pz),
      })
    }

    // ── Particle field ───────────────────────────────────────
    const particleCount = 120
    const pPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 20
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 14
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xC4A35A, size: 0.022, transparent: true, opacity: 0.35,
    })
    scene.add(new THREE.Points(pGeo, pMat))

    // ── Grid lines ───────────────────────────────────────────
    const gridMat = new THREE.LineBasicMaterial({ color: 0xC4B49A, transparent: true, opacity: 0.06 })
    for (let i = -5; i <= 5; i++) {
      const hGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-10, i * 1.2, -4),
        new THREE.Vector3( 10, i * 1.2, -4),
      ])
      const vGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(i * 2, -7, -4),
        new THREE.Vector3(i * 2,  7, -4),
      ])
      scene.add(new THREE.Line(hGeo, gridMat))
      scene.add(new THREE.Line(vGeo, gridMat))
    }

    // ── Animation loop ───────────────────────────────────────
    let frameId: number
    let t = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.008

      // Smooth mouse follow
      target.x += (mouse.x - target.x) * 0.04
      target.y += (mouse.y - target.y) * 0.04

      camera.position.x = target.x * 0.6
      camera.position.y = -target.y * 0.4
      camera.lookAt(scene.position)

      // Animate triangles
      triangles.forEach((tri, i) => {
        const wave = Math.sin(t + i * 0.7) * 0.3
        tri.mesh.position.x = tri.basePos.x + Math.sin(t * 0.5 + i) * 0.4 + target.x * (0.1 + i * 0.008)
        tri.mesh.position.y = tri.basePos.y + Math.cos(t * 0.4 + i) * 0.3 + wave - target.y * (0.08 + i * 0.005)
        tri.mesh.rotation.x += tri.rotSpd.x
        tri.mesh.rotation.y += tri.rotSpd.y
        tri.mesh.rotation.z += tri.rotSpd.z

        // Wrap around edges
        if (tri.mesh.position.x >  8) tri.mesh.position.x = -8
        if (tri.mesh.position.x < -8) tri.mesh.position.x =  8
        if (tri.mesh.position.y >  6) tri.mesh.position.y = -6
        if (tri.mesh.position.y < -6) tri.mesh.position.y =  6
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ───────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    />
  )
}
