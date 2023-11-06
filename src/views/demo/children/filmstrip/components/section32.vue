<template>
    <section>
        <p>
            script setup默认是不对外界暴露组件实例的，所以在其他组件中通过诸如$refs和$parent都默认无法获取当前组件实例，所有就开始使用defineExpose
            注： 如果子组件使用的是class模板 ，子组件就不用defineExpose ，正常写就行 ，但父组件还是要进行下面父组件中的步骤。
        </p>
    </section>
</template>
