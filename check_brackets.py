import sys

code = """
        const playDemo = () => {
            if (!demoActiveRef.current) return;

            // 0. Reset all states on every loop start
            setActiveScreen('login')
            setRxModalStep(0)
            setMockScansUploaded(false)
            setDashboardCases([])
            setEtaVisible(false)

            const pRect = appBodyRef.current.getBoundingClientRect()
            gsap.set(cursorRef.current, {
                x: pRect.width * 0.8,
                y: pRect.height * 0.9,
                scale: 1
            })

            // 1. Move to Login Button
            gsap.delayedCall(1.5, () => {
                if (!demoActiveRef.current || !cursorRef.current) return;
                
                const coords = getCoords(loginBtnRef);
                gsap.to(cursorRef.current, {
                    x: coords.x,
                    y: coords.y,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        if (!demoActiveRef.current) return;
                        
                        // Click
                        gsap.to(cursorRef.current, {
                            scale: 0.8,
                            duration: 0.1,
                            yoyo: true,
                            repeat: 1,
                            onComplete: () => {
                                if (!demoActiveRef.current) return;
                                setActiveScreen('dashboard')

                                // 2. Move to New Rx Request button
                                gsap.delayedCall(1.5, () => {
                                    if (!demoActiveRef.current || !cursorRef.current) return;
                                    
                                    const coords = getCoords(newRxBtnRef);
                                    gsap.to(cursorRef.current, {
                                        x: coords.x,
                                        y: coords.y,
                                        duration: 0.8,
                                        ease: "power2.inOut",
                                        onComplete: () => {
                                            if (!demoActiveRef.current) return;
                                            
                                            // Click
                                            gsap.to(cursorRef.current, {
                                                scale: 0.8,
                                                duration: 0.1,
                                                yoyo: true,
                                                repeat: 1,
                                                onComplete: () => {
                                                    if (!demoActiveRef.current) return;
                                                    setRxModalStep(1)

                                                    // 3. Move to Case Type select
                                                    gsap.delayedCall(0.8, () => {
                                                        if (!demoActiveRef.current || !cursorRef.current) return;
                                                        
                                                        const coords = getCoords(caseTypeSelectRef);
                                                        gsap.to(cursorRef.current, {
                                                            x: coords.x,
                                                            y: coords.y,
                                                            duration: 0.8,
                                                            ease: "power2.inOut",
                                                            onComplete: () => {
                                                                if (!demoActiveRef.current) return;
                                                                
                                                                // Click
                                                                gsap.to(cursorRef.current, {
                                                                    scale: 0.8,
                                                                    duration: 0.1,
                                                                    yoyo: true,
                                                                    repeat: 1,
                                                                    onComplete: () => {
                                                                        if (!demoActiveRef.current) return;

                                                                        // 4. Click Next -> Step 2
                                                                        gsap.delayedCall(0.8, () => {
                                                                            if (!demoActiveRef.current || !cursorRef.current) return;
                                                                            
                                                                            const coords = getCoords(nextBtn1Ref);
                                                                            gsap.to(cursorRef.current, {
                                                                                x: coords.x,
                                                                                y: coords.y,
                                                                                duration: 0.8,
                                                                                ease: "power2.inOut",
                                                                                onComplete: () => {
                                                                                    if (!demoActiveRef.current) return;
                                                                                    
                                                                                    // Click
                                                                                    gsap.to(cursorRef.current, {
                                                                                        scale: 0.8,
                                                                                        duration: 0.1,
                                                                                        yoyo: true,
                                                                                        repeat: 1,
                                                                                        onComplete: () => {
                                                                                            if (!demoActiveRef.current) return;
                                                                                            setRxModalStep(2)

                                                                                            // 5. Click Next -> Step 3
                                                                                            gsap.delayedCall(1.0, () => {
                                                                                                if (!demoActiveRef.current || !cursorRef.current) return;
                                                                                                
                                                                                                const coords = getCoords(nextBtn2Ref);
                                                                                                gsap.to(cursorRef.current, {
                                                                                                    x: coords.x,
                                                                                                    y: coords.y,
                                                                                                    duration: 0.8,
                                                                                                    ease: "power2.inOut",
                                                                                                    onComplete: () => {
                                                                                                        if (!demoActiveRef.current) return;
                                                                                                        
                                                                                                        // Click
                                                                                                        gsap.to(cursorRef.current, {
                                                                                                            scale: 0.8,
                                                                                                            duration: 0.1,
                                                                                                            yoyo: true,
                                                                                                            repeat: 1,
                                                                                                            onComplete: () => {
                                                                                                                if (!demoActiveRef.current) return;
                                                                                                                setRxModalStep(3)

                                                                                                                // 6. Processing upload
                                                                                                                gsap.delayedCall(0.8, () => {
                                                                                                                    if (!demoActiveRef.current) return;
                                                                                                                    setMockScansUploaded(true)

                                                                                                                    // 7. Click Submit Case
                                                                                                                    gsap.delayedCall(0.8, () => {
                                                                                                                        if (!demoActiveRef.current || !cursorRef.current) return;
                                                                                                                        
                                                                                                                        const coords = getCoords(submitBtnRef);
                                                                                                                        gsap.to(cursorRef.current, {
                                                                                                                            x: coords.x,
                                                                                                                            y: coords.y,
                                                                                                                            duration: 0.8,
                                                                                                                            ease: "power2.inOut",
                                                                                                                            onComplete: () => {
                                                                                                                                if (!demoActiveRef.current) return;
                                                                                                                                
                                                                                                                                // Click
                                                                                                                                gsap.to(cursorRef.current, {
                                                                                                                                    scale: 0.8,
                                                                                                                                    duration: 0.1,
                                                                                                                                    yoyo: true,
                                                                                                                                    repeat: 1,
                                                                                                                                    onComplete: () => {
                                                                                                                                        if (!demoActiveRef.current) return;
                                                                                                                                        setRxModalStep(0)
                                                                                                                                        setDashboardCases([
                                                                                                                                            { id: 'MH31AL-26040007-006', count: 1, title: 'ALIGNER KIT UI', type: 'CLEAR ALIGNER', date: 'Apr 15' }
                                                                                                                                        ])

                                                                                                                                        // 8. Move cursor away
                                                                                                                                        gsap.delayedCall(0.8, () => {
                                                                                                                                            if (!demoActiveRef.current || !cursorRef.current) return;
                                                                                                                                            
                                                                                                                                            const rect = appBodyRef.current?.getBoundingClientRect();
                                                                                                                                            gsap.to(cursorRef.current, {
                                                                                                                                                x: rect ? rect.width * 0.8 : 0,
                                                                                                                                                y: rect ? rect.height * 0.9 : 0,
                                                                                                                                                duration: 0.8,
                                                                                                                                                ease: "power2.inOut",
                                                                                                                                                onComplete: () => {
                                                                                                                                                    if (!demoActiveRef.current) return;
                                                                                                                                                    setEtaVisible(true)

                                                                                                                                                    // Restart loop after 5 seconds
                                                                                                                                                    gsap.delayedCall(5.0, playDemo)
                                                                                                                                                }
                                                                                                                                            })
                                                                                                                                        })
                                                                                                                                    }
                                                                                                                                })
                                                                                                                            }
                                                                                                                        })
                                                                                                                    })
                                                                                                                })
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                            })
                                                                                        }
                                                                                    })
                                                                                })
                                                                            })
                                                                        }
                                                                    })
                                                                })
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            })
        }
"""

lines = code.splitlines()
stack = []
mapping = {')': '(', '}': '{', ']': '['}

for line_idx, line in enumerate(lines, 1):
    for col_idx, char in enumerate(line, 1):
        if char in '({[':
            stack.append((char, line_idx, col_idx, line))
        elif char in ')}]':
            if not stack:
                print(f"Unmatched closing char '{char}' at line {line_idx}, col {col_idx}")
                print(f"Line content: {line}")
                sys.stdout.flush()
                exit(1)
            top_char, top_line, top_col, top_line_content = stack.pop()
            if line_idx >= 170:
                print(f"Line {line_idx}: '{char}' closed '{top_char}' from line {top_line}")
                sys.stdout.flush()
            if top_char != mapping[char]:
                print(f"Mismatch: '{char}' at line {line_idx}, col {col_idx} tries to close '{top_char}' from line {top_line}, col {top_col}")
                print(f"Context of mismatch line {line_idx}: {line}")
                print(f"Context of original line {top_line}: {top_line_content}")
                sys.stdout.flush()
                exit(1)

if stack:
    print("Unclosed braces left in stack:")
    for char, line_idx, col_idx, line in stack:
        print(f"  '{char}' at line {line_idx}, col {col_idx}: {line}")
    sys.stdout.flush()
    exit(1)

print("SUCCESS: All brackets match perfectly!")
sys.stdout.flush()
