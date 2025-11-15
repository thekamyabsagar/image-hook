"use client";

import { useState } from "react";
import axios from "axios";

interface AnalysisResponse {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;

        // Send to N8N webhook
        const webhookUrl =
          "";

        const analysisResponse = await axios.post(
          webhookUrl,
          {
            image: base64String,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setResponse({
          success: true,
          data: analysisResponse.data,
        });
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || "Failed to analyze image");
      setResponse({
        success: false,
        error: err.message || "Failed to analyze image",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview("");
    setResponse(null);
    setError("");
  };

  return (
    <div className="container-main">
      <div className="content-wrapper">
        <div className="card">
          <h1>Image Analysis</h1>
          <p className="card-subtitle">Upload an image for N8N webhook analysis</p>

          <form onSubmit={handleUpload}>
            {/* File Input */}
            <div className="form-group">
              <div className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="upload-label">
                  <svg
                    className="upload-icon"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-8-8l-3.172-3.172a4 4 0 00-5.656 0L12 16m16-8h8v8m-8-8v-8"
                    />
                  </svg>
                  <p className="upload-text">Click to upload or drag and drop</p>
                  <p className="upload-subtext">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>

            {/* File Name */}
            {file && (
              <div className="form-group">
                <div className="file-info">
                  <p>Selected file:</p>
                  <p className="file-info-name">{file.name}</p>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {preview && (
              <div className="form-group preview-section">
                <p className="preview-label">Preview:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="preview-image"
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="form-group">
                <div className="error-message">{error}</div>
              </div>
            )}

            {/* Response */}
            {response && (
              <div className="form-group">
                <div className={response.success ? "success-message" : "error-message"}>
                  <h3 className={response.success ? "success-title" : ""}>
                    {response.success ? "✓ Analysis Complete" : "✗ Error"}
                  </h3>
                  <pre className="response-code">
                    {JSON.stringify(response.data || response.error, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="form-group">
              <div className="button-group">
                <button
                  type="submit"
                  disabled={!file || loading}
                  className="button button-primary"
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="button button-secondary"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>

          {/* Webhook Info */}
          <div className="webhook-info">
            <p className="webhook-label"><strong>Webhook URL:</strong></p>
            <p className="webhook-url">https://sagarn8n.codes/webhook-test/image-analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
}
