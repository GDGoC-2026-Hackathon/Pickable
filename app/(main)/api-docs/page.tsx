export default function ApiDocsPage() {
  return (
    <main style={{ padding: 28 }}>
      <section
        style={{
          maxWidth: 840,
          margin: "0 auto",
          borderRadius: 18,
          background: "#fff",
          border: "1px solid rgba(15, 23, 42, 0.06)",
          boxShadow: "0 18px 40px rgba(2, 8, 23, 0.06)",
          padding: 18,
        }}
      >
        <h1 style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.02em" }}>
          API 문서
        </h1>
        <p style={{ marginTop: 10, color: "rgba(11, 18, 32, 0.62)", fontWeight: 800 }}>
          현재 `swagger-ui-react` 의존성이 설치되어 있지 않아 Swagger UI 렌더링을
          비활성화했습니다.
          <br />
          (CI/Cloud Run 환경에서 빌드가 실패하지 않도록 임시 처리)
        </p>
      </section>
    </main>
  );
}
