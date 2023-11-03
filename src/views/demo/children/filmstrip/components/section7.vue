<template>
    <section data-auto-animate>
        <h2 data-id="code-title">狠狠的Hook</h2>
        <pre data-id="code-animation">
            <code class="hljs javascript" data-trim data-line-numbers="|4,8-11|17|22-24">
                {{ htmlStr }}
            </code>
        </pre>
    </section>
</template>

<script setup>
import { ref } from 'vue'
const htmlStr = ref(`
        import React, { useState } from 'react';
        function Example() {
            const [count, setCount] = useState(0);
            return (
                <div>
                <p>已点击 {count} 次</p>
                <button onClick={() => setCount(count + 1)}>
                    狠狠的点击🥵🥵
                </button>
                </div>
            );
        }
        function SecondExample() {
            const [count, setCount] = useState(0);

            return (
                <div>
                <p>已点击 {count} 次</p>
                <button onClick={() => setCount(count + 1)}>
                    狠狠的点击🥵🥵
                </button>
                </div>
            );
        }
`)
</script>
