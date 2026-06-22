import os

def generate_play_demo():
    # We will build the playDemo function body by nesting blocks from inside-out using simple string replacements.

    # Level 8: Move cursor away
    step8 = """
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
"""

    # Level 7: Click Submit Case
    step7_inner = """
setRxModalStep(0)
setDashboardCases([
    { id: 'MH31AL-26040007-006', count: 1, title: 'ALIGNER KIT UI', type: 'CLEAR ALIGNER', date: 'Apr 15' }
])

// 8. Move cursor away
__STEP8__
"""
    step7_inner = step7_inner.replace("__STEP8__", step8.strip())
    step7_inner_indented = "\n".join("    " + line if line.strip() else line for line in step7_inner.strip().split("\n"))

    step7 = """
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
__STEP7_INNER__
                }
            })
        }
    })
})
"""
    step7 = step7.replace("__STEP7_INNER__", step7_inner_indented)

    # Level 6: Processing upload
    step6_inner = """
if (!demoActiveRef.current) return;
setMockScansUploaded(true)

// 7. Click Submit Case
__STEP7__
"""
    step6_inner = step6_inner.replace("__STEP7__", step7.strip())
    step6_inner_indented = "\n".join("    " + line if line.strip() else line for line in step6_inner.strip().split("\n"))

    step6 = """
gsap.delayedCall(0.8, () => {
__STEP6_INNER__
})
"""
    step6 = step6.replace("__STEP6_INNER__", step6_inner_indented)

    # Level 5: Click Next -> Step 3
    step5_inner = """
setRxModalStep(3)

// 6. Processing upload
__STEP6__
"""
    step5_inner = step5_inner.replace("__STEP6__", step6.strip())
    step5_inner_indented = "\n".join("    " + line if line.strip() else line for line in step5_inner.strip().split("\n"))

    step5 = """
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
__STEP5_INNER__
                }
            })
        }
    })
})
"""
    step5 = step5.replace("__STEP5_INNER__", step5_inner_indented)

    # Level 4: Click Next -> Step 2
    step4_inner = """
setRxModalStep(2)

// 5. Click Next -> Step 3
__STEP5__
"""
    step4_inner = step4_inner.replace("__STEP5__", step5.strip())
    step4_inner_indented = "\n".join("    " + line if line.strip() else line for line in step4_inner.strip().split("\n"))

    step4 = """
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
__STEP4_INNER__
                }
            })
        }
    })
})
"""
    step4 = step4.replace("__STEP4_INNER__", step4_inner_indented)

    # Level 3: Move to Case Type select
    step3_inner = """
// 4. Click Next -> Step 2
__STEP4__
"""
    step3_inner = step3_inner.replace("__STEP4__", step4.strip())
    step3_inner_indented = "\n".join("    " + line if line.strip() else line for line in step3_inner.strip().split("\n"))

    step3 = """
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
__STEP3_INNER__
                }
            })
        }
    })
})
"""
    step3 = step3.replace("__STEP3_INNER__", step3_inner_indented)

    # Level 2: Move to New Rx Request button
    step2_inner = """
setRxModalStep(1)

// 3. Move to Case Type select
__STEP3__
"""
    step2_inner = step2_inner.replace("__STEP3__", step3.strip())
    step2_inner_indented = "\n".join("    " + line if line.strip() else line for line in step2_inner.strip().split("\n"))

    step2 = """
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
__STEP2_INNER__
                }
            })
        }
    })
})
"""
    step2 = step2.replace("__STEP2_INNER__", step2_inner_indented)

    # Level 1: Move to Login Button
    step1_inner = """
setActiveScreen('dashboard')

// 2. Move to New Rx Request button
__STEP2__
"""
    step1_inner = step1_inner.replace("__STEP2__", step2.strip())
    step1_inner_indented = "\n".join("    " + line if line.strip() else line for line in step1_inner.strip().split("\n"))

    step1 = """
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
__STEP1_INNER__
                }
            })
        }
    })
})
"""
    step1 = step1.replace("__STEP1_INNER__", step1_inner_indented)

    # Final playDemo function
    play_demo_body = """
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
__STEP1__
}
"""
    play_demo_body = play_demo_body.replace("__STEP1__", step1.strip())
    
    # We will indent everything with 8 spaces to fit nicely into PortalTeaser.jsx
    play_demo_indented = "\n".join("        " + line if line.strip() else line for line in play_demo_body.strip().split("\n"))
    return play_demo_indented

def check_brackets(code):
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
                    return False
                top_char, top_line, top_col, top_line_content = stack.pop()
                if top_char != mapping[char]:
                    print(f"Mismatch: '{char}' at line {line_idx}, col {col_idx} tries to close '{top_char}' from line {top_line}, col {top_col}")
                    print(f"Context of mismatch line {line_idx}: {line}")
                    print(f"Context of original line {top_line}: {top_line_content}")
                    return False

    if stack:
        print("Unclosed braces left in stack:")
        for char, line_idx, col_idx, line in stack:
            print(f"  '{char}' at line {line_idx}, col {col_idx}: {line}")
        return False

    print("SUCCESS: Generated playDemo code is perfectly syntax-clean!")
    return True

play_demo_code = generate_play_demo()
if check_brackets(play_demo_code):
    # Now read PortalTeaser.jsx, find the range of playDemo, and replace it!
    file_path = "src/components/PortalTeaser.jsx"
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Let's locate playDemo in the file
    start_marker = "        const playDemo = () => {"
    
    # Find start index
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print("Error: Could not find playDemo function start in PortalTeaser.jsx")
        exit(1)
        
    # We want to find the playDemo end. In the file, the next thing after playDemo is:
    #         // Start the recursive demo loop
    #         playDemo()
    end_ref_marker = "        // Start the recursive demo loop"
    end_ref_idx = content.find(end_ref_marker)
    if end_ref_idx == -1:
        print("Error: Could not find playDemo recursive call in PortalTeaser.jsx")
        exit(1)
        
    new_content = content[:start_idx] + play_demo_code + "\n\n" + content[end_ref_idx:]
    
    # Write the new content
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("PortalTeaser.jsx successfully updated!")
else:
    print("Failed validation of generated code. Not updating.")
