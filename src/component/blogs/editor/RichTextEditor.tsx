"use client"

import dynamic from "next/dynamic"
import { Controller } from "react-hook-form"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control?: any
    name?: string
    error?: string
}

export function RichTextEditor({ value, onChange, placeholder, control, name, error }: RichTextEditorProps) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            ["blockquote", "code-block"],
            [{ script: "sub" }, { script: "super" }],
            ["clean"],
        ],
    }

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
        "blockquote",
        "code-block",
        "script",
    ]

    if (control && name) {
        return (
            <div className="space-y-2">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <div className="bg-white">
                            <ReactQuill
                                theme="snow"
                                value={field.value}
                                onChange={field.onChange}
                                modules={modules}
                                formats={formats}
                                placeholder={placeholder}
                                style={{
                                    height: "200px",
                                    marginBottom: "50px",
                                }}
                            />
                        </div>
                    )}
                />
                {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
        )
    }

    return (
        <div className="bg-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                style={{
                    height: "200px",
                    marginBottom: "50px",
                }}
            />
        </div>
    )
}