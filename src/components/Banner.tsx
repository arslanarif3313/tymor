"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LiquidDistortion = ({ image, active }: { image: string, active: boolean }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouse = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        let animationFrameId: number;
        let texture: WebGLTexture | null = null;

        const vsSource = `
            attribute vec2 position;
            varying vec2 vUv;
            void main() {
                vUv = position * 0.5 + 0.5;
                vUv.y = 1.0 - vUv.y;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fsSource = `
            precision highp float;
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform vec2 uMouse;
            uniform vec2 uResolution;
            uniform float uTime;
            uniform float uActive;

            void main() {
                vec2 uv = vUv;
                
                // 1. Correct aspect ratio for a perfect circle
                vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
                float dist = distance(uv * aspect, uMouse * aspect);
                
                // 2. Focused "Small Circle" interaction
                float radius = 0.15; 
                float interactionZone = 1.0 - smoothstep(0.0, radius, dist);
                
                // 3. Subtle background ambient liquid flow
                float flowX = sin(uv.y * 5.0 + uTime * 0.3) * 0.0015;
                float flowY = cos(uv.x * 5.0 + uTime * 0.3) * 0.0015;
                
                vec2 dir = normalize((uv - uMouse) * aspect);
                if(dist == 0.0) dir = vec2(0.0);
                
                // Refined delicate displacement - slightly faster ripples
                float ripple = sin(dist * 50.0 - uTime * 6.0) * 0.006 * interactionZone * uActive;
                float push = interactionZone * 0.02 * uActive;
                
                vec2 finalUv = uv + vec2(flowX, flowY) - dir * (push + ripple);
                finalUv = clamp(finalUv, 0.001, 0.999);
                
                vec4 color = texture2D(uTexture, finalUv);
                
                // Soft reflective highlight
                float highlight = smoothstep(0.01, 0.0, abs(dist - radius * 0.5)) * 0.04 * uActive;
                color.rgb += highlight;

                gl_FragColor = color;
            }
        `;

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const program = gl.createProgram();
        const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!program || !vs || !fs) return;

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLoc = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const uTextureLoc = gl.getUniformLocation(program, 'uTexture');
        const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
        const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
        const uTimeLoc = gl.getUniformLocation(program, 'uTime');
        const uActiveLoc = gl.getUniformLocation(program, 'uActive');

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = image;
        img.onload = () => {
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        };

        let currentActive = 0;
        const render = (time: number) => {
            const rect = canvas.getBoundingClientRect();
            if (canvas.width !== rect.width || canvas.height !== rect.height) {
                canvas.width = rect.width;
                canvas.height = rect.height;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            // Snappier mouse tracking
            mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.15;
            mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.15;

            // Snappier active state transition
            const targetActive = active ? 1.0 : 0.0;
            currentActive += (targetActive - currentActive) * (active ? 0.12 : 0.08);

            gl.uniform2f(uMouseLoc, mouse.current.x, mouse.current.y);
            gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
            gl.uniform1f(uTimeLoc, time * 0.001);
            gl.uniform1f(uActiveLoc, currentActive);

            if (texture) {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.current.targetX = (e.clientX - rect.left) / rect.width;
            mouse.current.targetY = (e.clientY - rect.top) / rect.height;
        };

        canvas.parentElement?.addEventListener('mousemove', onMouseMove);
        animationFrameId = requestAnimationFrame(render);

        return () => {
            canvas.parentElement?.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            if (texture) gl.deleteTexture(texture);
        };
    }, [image, active]);

    return (
        <canvas
            ref={canvasRef}
            className="w-100 h-100 position-absolute top-0 left-0"
            style={{ zIndex: 1, cursor: 'pointer', borderRadius: '40px', background: '#0f1012' }}
        />
    );
};

const steps = [
    {
        id: 1,
        title: "Step 01 — Holobox Discovery Meeting",
        description: "Tymor aligns every dimension of your MetaHuman — appearance, voice, tone, personality, and knowledge — with your company's identity, brand standards, and messaging framework. Built deliberately. All consistent. Owned entirely by your identity.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-01-—-Discovery-Meeting.jpg"
    },
    {
        id: 2,
        title: "Step 02 — Design Your Meta Human",
        description: "Every MetaHuman is built from scratch. We start with you. Your brand brief, your audience, your tone, your world.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-02-—-Design-Your-Meta-Human.jpg"
    },
    {
        id: 3,
        title: "Step 03 — Voice & Speech Production",
        description: "The voice your MetaHuman delivers through the Holobox is the first impression, the trust signal, and the brand moment — all in one. Our voice engineers build with that responsibility in every session, across every language, for each deployment.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-03-—-Voice-&-Speech-Production.jpg"
    },
    {
        id: 4,
        title: "Step 04 — Facial Expressions & Movement",
        description: "Your MetaHuman doesn't just talk. It reacts. Tymor programs all 56 facial action units — every emotion, every lip sync shape, every gesture — so every conversation through the Holobox feels genuinely alive.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-04-—-Facial-Expressions-&-Movement.jpg"
    },
    {
        id: 5,
        title: "Step 05 — AI Brain & Integration",
        description: "What your MetaHuman knows, how it speaks, when it escalates, and where it draws the line. That is not a configuration setting. That is Tymor's craft.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-05-—-AI-Brain-&-Integration.jpg"
    },
    {
        id: 6,
        title: "Step 06 — Go-Live & Ongoing Management",
        description: "A Tymor engineer activates your Holobox and from that moment we own it — monitoring, content updates, and analytics. Most vendors walk away at go-live. We are just getting started.",
        image: "/Tymore%20Ai%20with%20Holobox/Step-06-—-Go-Live-&-Ongoing-Management.jpg"
    }
];

export default function Banner() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

    return (
        <section className="banner-section py-100" id="process" style={{ backgroundColor: '#0f1012' }}>
            <div className="container-fluid px-md-5">
                <div className="banner-stack d-flex flex-column align-items-center w-100">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="banner-card"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                top: isMobile ? `${100 + (index * 30)}px` : `${150 + (index * 45)}px`,
                                zIndex: index + 1,
                                width: isMobile ? '95%' : '75%', // Slightly smaller width for better spacing
                                margin: isMobile ? '0 auto 100px auto' : '0 auto 500px auto',
                                overflow: 'visible',
                                borderRadius: '40px'
                            }}
                        >
                            <motion.div
                                className="position-relative overflow-hidden w-100"
                                style={{
                                    height: isMobile ? '50vh' : '65vh',
                                    minHeight: '300px',
                                    maxHeight: '700px',
                                    background: '#0f1012',
                                    borderRadius: '40px'
                                }}
                                animate={{
                                    boxShadow: hoveredIndex === index ? '0 30px 60px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.1)'
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            >
                                <img src={step.image} alt={step.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }} />
                                <LiquidDistortion image={step.image} active={hoveredIndex === index} />

                                <div className="banner-content" style={{ zIndex: 10, pointerEvents: 'none', padding: isMobile ? '20px' : '40px' }}>
                                    <div className="banner-tags" style={{ pointerEvents: 'auto' }}>
                                        <span className="text-nowrap" style={{ fontSize: isMobile ? '10px' : '14px', padding: isMobile ? '6px 12px' : '10px 24px' }}>PROCESS</span>
                                        <span className="text-nowrap" style={{ fontSize: isMobile ? '10px' : '14px', padding: isMobile ? '6px 12px' : '10px 24px' }}>STEP {step.id < 10 ? `0${step.id}` : step.id}</span>
                                    </div>
                                    <h2 className="text-white mt-4 anton-font text-uppercase" style={{ fontSize: isMobile ? '1.8rem' : '3rem' }}>{step.title}</h2>
                                    <p className="text-white-50 mt-3" style={{ fontSize: isMobile ? '0.9rem' : '1.2rem', maxWidth: '600px' }}>{step.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
