"use client";

import { useState, useCallback } from "react";
import * as pdfjs from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface FileUploadProps {
    onFileContent: (content: string) => void;
}

export function FileUpload({ onFileContent }: FileUploadProps) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const extractPDFText = useCallback(async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.filter((item) => "str" in item).map((item) => item.str).join(" ") + "\n";
        }

        return text.trim();
    }, []);

    const handleFile = useCallback(async (file: File) => {
        try {
            setError(null);
            setLoading(true);
            setFileName(file.name);

            if (file.type === "application/pdf") {
                const text = await extractPDFText(file);
                onFileContent(text);
            } else {
                const text = await file.text();
                onFileContent(text);
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to read file"
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [onFileContent, extractPDFText]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt', '.md'],
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
            >
                <input {...getInputProps()} disabled={loading} />
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <Upload 
                            className={`h-12 w-12 ${
                                isDragActive ? 'text-primary' : 'text-muted-foreground'
                            }`}
                        />
                    </div>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">
                            {loading ? 'Processing file...' : isDragActive
                                ? 'Drop the file here'
                                : fileName 
                                    ? `File selected: ${fileName}`
                                    : 'Drag & drop a file here, or click to browse'
                            }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Supports PDF, TXT, and MD files
                        </p>
                    </div>
                </div>
            </div>
            {error && (
                <p className="text-destructive mt-2 text-sm">{error}</p>
            )}
        </div>
    );
}
