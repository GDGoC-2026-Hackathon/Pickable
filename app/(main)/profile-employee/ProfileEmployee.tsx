'use client';

import Link from 'next/link'
import { useRouter } from "next/navigation";

import React from "react";
import "./ProfileEmployee.css";

export default function ProfileEmployee() {
  const router = useRouter();

  return (
    <div className="pe-page">
      {/* Content */}
      <main className="pe-main">
        <div className="pe-container">
          <div className="pe-title-area">
            <div className="pe-eyebrow">JOB SEEKER SETUP</div>
            <h1 className="pe-title">취업 준비생 프로필 완성하기</h1>
            <p className="pe-subtitle">
              AI가 당신의 역량과 라이프스타일을 분석하여 최적의 기업을 찾아드립니다.
            </p>
          </div>

          {/* Card 1: 기본 정보 */}
          <section className="pe-card">
            <div className="pe-card-head">
              <span className="pe-icon pe-icon-user" aria-hidden="true">👤</span>
              <h2 className="pe-card-title">기본 정보</h2>
            </div>

            <div className="pe-grid pe-grid-2">
              <div className="pe-field">
                <label className="pe-label">이름</label>
                <input className="pe-input" placeholder="성함을 입력해주세요" />
              </div>

              <div className="pe-field">
                <label className="pe-label">생년월일</label>
                <div className="pe-input-wrap">
                  <input className="pe-input" placeholder="mm/dd/yyyy" />
                  <span className="pe-input-icon" aria-hidden="true">📅</span>
                </div>
              </div>

              <div className="pe-field">
                <label className="pe-label">성별</label>
                <div className="pe-seg">
                  <button className="pe-seg-btn is-active" type="button">
                    남성 (Male)
                  </button>
                  <button className="pe-seg-btn" type="button">
                    여성 (Female)
                  </button>
                </div>
              </div>

              <div className="pe-field">
                <label className="pe-label">최종학력</label>
                <input className="pe-input" placeholder="대학교(4년 이상)" />
              </div>

              <div className="pe-field pe-span-2">
                <label className="pe-label">전공</label>
                <input
                  className="pe-input"
                  placeholder="전공명을 입력해주세요 (예: 컴퓨터공학)"
                />
              </div>
            </div>
          </section>

          {/* Card 2: 선호 근무 조건 */}
          <section className="pe-card">
            <div className="pe-card-head">
              <span className="pe-icon pe-icon-brief" aria-hidden="true">💼</span>
              <h2 className="pe-card-title">선호 근무 조건</h2>
            </div>

            <div className="pe-grid pe-grid-2">
              <div className="pe-field">
                <label className="pe-label">희망 직군/직무</label>
                <input
                  className="pe-input"
                  placeholder="개발 (Backend / Frontend)"
                />
              </div>

              <div className="pe-field">
                <label className="pe-label">희망 근무지</label>
                <input className="pe-input" placeholder="예: 서울 강남구, 경기 판교" />
              </div>

              <div className="pe-field">
                <label className="pe-label">희망 연봉</label>
                <input className="pe-input" placeholder="3,000만원 ~ 3,500만원" />
              </div>

              <div className="pe-field">
                <label className="pe-label">고용 형태</label>
                <input className="pe-input" placeholder="정규직" />
              </div>

              <div className="pe-field">
                <label className="pe-label">선호 출근 시간</label>
                <div className="pe-input-wrap">
                  <input className="pe-input" placeholder="09:00 AM" />
                  <span className="pe-input-icon" aria-hidden="true">🕘</span>
                </div>
              </div>

              <div className="pe-field">
                <label className="pe-label">선호 퇴근 시간</label>
                <div className="pe-input-wrap">
                  <input className="pe-input" placeholder="06:00 PM" />
                  <span className="pe-input-icon" aria-hidden="true">🕕</span>
                </div>
              </div>
            </div>
          </section>

          {/* Card 3: 전문 스킬 */}
          <section className="pe-card">
            <div className="pe-card-head">
              <span className="pe-icon pe-icon-skill" aria-hidden="true">💠</span>
              <h2 className="pe-card-title">전문 스킬</h2>
            </div>

            <p className="pe-help">
              앞서 선택하신 개발 직무에 추천되는 스킬입니다.
            </p>

            <div className="pe-chips">
              <button className="pe-chip is-selected" type="button">Python</button>
              <button className="pe-chip is-selected" type="button">SQL</button>
              <button className="pe-chip" type="button">Java</button>
              <button className="pe-chip" type="button">Spark</button>
              <button className="pe-chip" type="button">AWS</button>
              <button className="pe-chip pe-chip-add" type="button">+ 직접 입력</button>
            </div>
          </section>

          {/* Card 4: 경력 및 프로젝트 */}
          <section className="pe-card pe-card-dark">
            <div className="pe-card-head">
              <span className="pe-icon pe-icon-doc" aria-hidden="true">📄</span>
              <h2 className="pe-card-title pe-card-title-dark">경력 및 프로젝트</h2>
            </div>

            <div className="pe-upload">
              <div className="pe-upload-box">
                <div className="pe-upload-text">
                  <div className="pe-upload-title">PDF 파일을 드래그하거나</div>
                  <div className="pe-upload-title">클릭하여 업로드하세요</div>
                </div>
                <button className="pe-upload-btn" type="button">
                  파일 선택
                </button>
              </div>

              <div className="pe-upload-note">
                <span className="pe-info-dot" aria-hidden="true">i</span>
                업로드된 파일은 AI가 분석하여 기업 매칭에 활용됩니다.
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="pe-cta">
            <button
              className="pe-cta-btn"
              type="button"
              onClick={() => router.push("/main-page-employee")}
            >
              프로필 저장하고 매칭 시작 <span aria-hidden="true">›</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
