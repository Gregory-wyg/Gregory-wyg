<template>
  <div class="canvas-container">
    <canvas
      id="three"
      @mousemove="onDocumentMouseMove"
      @mousedown="onDocumentMouseDown"
    ></canvas>
    <div>
      <UserCard class="user-card" :style="userCardStyle"></UserCard>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import UserCard from "components/UserCard.vue";

export default {
  components: { UserCard },
  data() {
    return {
      scene: null, // 场景
      renderer: null, // 渲染器
      camera: null, // 相机
      loader: null, // 加载器
      canvas: null, // 画布
      ballList: [], // 300个球
      mouse: null, // 鼠标
      raycaster: null, // 射线
      runFlag: true, // 是否运动
      userCardStyle: {
        top: 0,
        left: 0,
      },
    };
  },
  mounted() {
    this.initThree();
    this.animate();
  },
  methods: {
    /**
     * 初始化three
     */
    initThree() {
      this.canvas = document.querySelector("#three");
      window.addEventListener("resize", this.onWindowResize);

      //场景
      this.scene = new THREE.Scene();
      this.scene.add(new THREE.AmbientLight(0x404040));

      //加载器
      this.loader = new THREE.TextureLoader();

      //渲染器
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
      });

      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

      //相机
      this.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        200
      );
      this.camera.position.set(0, 0, 20);
      this.camera.lookAt(0, 0, 0);

      const controls = new OrbitControls(this.camera, this.canvas);
      controls.maxPolarAngle = Math.PI * 0.5;
      controls.minDistance = 1;
      controls.maxDistance = 30;
      controls.addEventListener("change", this.render);

      // 射线
      this.raycaster = new THREE.Raycaster();

      // 鼠标
      this.mouse = new THREE.Vector2();

      // 构建场景内容
      this.setupScene();
    },

    /**
     * 构建场景内容
     */
    setupScene() {
      //模型
      const geometry = new THREE.IcosahedronGeometry(1, 15);

      for (let i = 0; i < 100; i++) {
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.9, Math.random() * 0.7);

        const material = new THREE.MeshBasicMaterial({ color: color });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 100 - 50;
        mesh.position.y = Math.random() * 100 - 50;
        mesh.position.z = Math.random() * 100 - 50;
        mesh.position.normalize().multiplyScalar(Math.random() * 10 + 10);
        mesh.scale.setScalar(Math.random() * Math.random() + 0.5);
        this.scene.add(mesh);

        this.ballList.push(mesh);
      }
    },

    /**
     * 监听鼠标移动
     */
    onDocumentMouseMove(e) {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },

    /**
     * 监听鼠标点击
     */
    onDocumentMouseDown(e) {
      // e.preventDefault();
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // 根据当前鼠标坐标以及相机调整射线
      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        false
      );
      if (intersects.length > 0) {
        const object = intersects[0].object;
        console.log(object);
        object.visible = false;
        this.runFlag = false;
        console.log(e.clientX, e.clientY);
        if (e.clientX + 300 < window.innerWidth) {
          this.userCardStyle.left = e.clientX + "px";
        } else {
          this.userCardStyle.left = e.clientX - 300 + "px";
        }

        if (e.clientY + 400 < window.innerHeight) {
          this.userCardStyle.top = e.clientY + "px";
        } else {
          this.userCardStyle.top = e.clientY - 400 + "px";
        }
        this.render();
      }
    },

    /**
     * 监听窗口大小改变
     */
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.updateProjectionMatrix();
    },

    /**
     * 动画效果
     */
    animate() {
      requestAnimationFrame(this.animate);
      this.render(this.runFlag);
    },

    /**
     * 渲染
     */
    render() {
      if (this.runFlag) {
        const timer = 0.0001 * Date.now();
        for (let i = 0; i < this.ballList.length; i++) {
          const ball = this.ballList[i];
          ball.position.x = 10 * Math.cos(timer + i);
          ball.position.y = 10 * Math.sin(timer + i * 1.1);
        }
      }
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  background: url("assets/images/background.png") no-repeat;
  background-size: cover;
  background-position: center 0;
  position: relative;
  #three {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
  }
  .user-card {
    width: 300px;
    height: 400px;
    position: absolute;
  }
}
</style>
