"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.2rem",
        color: "#666",
      }}
    >
      API 문서를 불러오는 중...
    </div>
  ),
});

export default function ApiDocsPage() {
  useEffect(() => {
    // swagger-ui-react 내부 ModelCollapse 등이 사용하는
    // deprecated lifecycle 메서드 경고를 억제
    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("UNSAFE_componentWillReceiveProps")
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        background: "#ffffff",
        color: "#3b4151",
        overflowY: "auto",
      }}
    >
      <SwaggerUI url="/openapi.yaml" />
    </div>
  );
}
