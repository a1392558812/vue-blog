<template>
  <div>
    <div class="w-[100%] notice">这是一个纯css的冰墩墩,掘金大佬做的，</div>
    <div class="w-[100%] notice">觉得好看就放这里来了。</div>
    <div class="w-[100%] notice">一时没想好这个页做点啥。</div>
    <div id="bingdundun" style="z-index: 0">
      <div class="body" />
      <div class="earLeft" />
      <div class="earRight" />
      <div class="face" />
      <div class="eyeLeft" />
      <div class="eyeLeft eyeRight" />
      <div class="nose" />
      <div class="mouth" />
      <div class="handLeft" />
      <div class="handRight" />
      <div class="footerLeft" />
      <div class="footerLeft footerRight" />
    </div>
  </div>
</template>
<script setup>
defineOptions({ name: 'bingDwenDwen-model1' })
</script>
<style scope lang="scss">
.notice {
  font-size: 15px;
  text-align: center;
}
#bingdundun {
  position: relative;
  width: 400px;
  height: 400px;
  overflow: visible;
}
#bingdundun .body {
  position: absolute;
  top: 76px;
  left: 93px;
  width: 211px;
  height: 237px;
  border-radius: 91px 105px 74px 84px/128px 119px 129px 114px;
  background-color: #fff;
  border: 5px solid #393939;
  box-sizing: border-box;
  z-index: 1;
}
#bingdundun .earLeft {
  position: absolute;
  top: 77px;
  left: 113px;
  width: 43px;
  height: 66px;
  transform: rotate(343deg);
  background-color: #393939;
  border-radius: 91px 52px 74px 84px/128px 68px 129px 114px;
}
#bingdundun .earRight {
  position: absolute;
  top: 76px;
  left: 243px;
  width: 39px;
  height: 50px;
  transform: rotate(190deg);
  background-color: #393939;
  border-radius: 7px 52px 74px 84px/33px 68px 129px 114px;
}
#bingdundun .face {
  position: absolute;
  top: 108px;
  left: 117px;
  width: 164px;
  height: 131px;
  border-radius: 98px 124px 82px 84px/104px 93px 66px 70px;
  background-color: #fff;
  box-shadow:
    rgb(102, 201, 253) 0 0 0 3px,
    rgb(173, 35, 96) 0 0 0 5px,
    rgb(81, 122, 183) 0 0 0 7px,
    rgb(250, 198, 70) 0 0 0 9px,
    rgb(128, 201, 111) 0 0 0 12px;
  z-index: 2;
}
#bingdundun .eyeLeft {
  position: absolute;
  top: 132px;
  left: 133px;
  width: 47px;
  height: 65px;
  transform: rotate(45deg);
  background-color: rgb(57, 56, 63);
  border-radius: 69px 62px 69px 69px/97px 93px 97px 97px;
  z-index: 4;
}
#bingdundun .eyeLeft::before {
  content: '';
  position: absolute;
  top: 13px;
  left: 15px;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 3px solid #fff;
  background-color: rgb(60, 60, 57);
  z-index: 5;
  box-sizing: border-box;
}
#bingdundun .eyeLeft::after {
  content: '';
  position: absolute;
  top: 18px;
  left: 25px;
  width: 6px;
  height: 6px;
  z-index: 6;
  border-radius: 50%;
  background-color: #fff;
  z-index: 6;
}
#bingdundun .eyeRight {
  left: 218px;
  transform: rotate(-45deg);
}
#bingdundun .eyeRight::before {
  top: 10px;
  left: 9px;
}
#bingdundun .eyeRight::after {
  top: 15px;
  left: 16px;
}
#bingdundun .nose {
  position: absolute;
  top: 175px;
  left: 188px;
  width: 26px;
  height: 14px;
  transform: rotate(180deg);
  z-index: 6;
  overflow: hidden;
}
#bingdundun .nose::after {
  width: 20px;
  height: 20px;
  background-color: #393939;
  border-radius: 6px 9px 9px 16px / 6px 8px 6px 6px;
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  transform-origin: top left;
  transform: rotate(45deg) translate3d(50%, -50%, 0);
  box-sizing: border-box;
}
#bingdundun .mouth {
  position: absolute;
  top: 192px;
  left: 176px;
  width: 50px;
  height: 35px;
  background-color: #393939;
  border-radius: 50% 48% 60% / 48% 45%;
  transform: rotate(1deg);
  z-index: 5;
}
#bingdundun .mouth::before {
  content: '';
  position: absolute;
  top: -12px;
  left: 4px;
  width: 35px;
  height: 20px;
  border-radius: 50%;
  background-color: #fff;
  z-index: 1;
}
#bingdundun .mouth::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 7px;
  width: 36px;
  height: 13px;
  background-color: rgb(163, 51, 51);
  border-radius: 50% 48% 80% 80% / 68% 45% 80% 60%;
}
#bingdundun .handLeft {
  position: absolute;
  top: 203px;
  left: 83px;
  width: 40px;
  height: 70px;
  background-color: #393939;
  transform: rotate(30deg);
}
#bingdundun .handLeft::after {
  content: '';
  position: absolute;
  bottom: -22px;
  left: 0;
  width: 41px;
  height: 40px;
  background-color: #393939;
  border-radius: 50%;
}
#bingdundun .handRight {
  position: absolute;
  top: 160px;
  left: 270px;
  width: 40px;
  height: 70px;
  background-color: #393939;
  border-radius: 44px 0 80px / 100px 30px 100px;
  transform: rotate(40deg);
  transform-origin: bottom center;
}
#bingdundun .handRight::after {
  content: '❤';
  position: absolute;
  top: -14px;
  left: 5px;
  width: 35px;
  height: 35px;
  font-size: 20px;
  text-align: center;
  letter-spacing: -2px;
  color: rgb(163, 51, 51);
  background-color: #393939;
  border-radius: 40px 40px 55px / 100px 40px 100px 0;
  transform: rotate(-55deg);
  transform-origin: center;
}
#bingdundun .footerLeft {
  position: absolute;
  top: 300px;
  left: 142px;
  width: 40px;
  height: 40px;
  background-color: #393939;
  border-radius: 0 50px / 0 18px 0 0;
  z-index: 7;
}
#bingdundun .footerLeft::before {
  content: '';
  position: absolute;
  bottom: -14px;
  left: 0;
  width: 42px;
  height: 20px;
  background-color: #393939;
  border-radius: 0 14px 4px;
}
#bingdundun .footerRight {
  left: 220px;
  transform: rotateY(180deg);
}
</style>
