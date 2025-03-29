import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-full-spinner",
  template: `
    <div class="loader-container">
      <div class="taskflow-loader">
        <div class="logo-container">
          <div class="logo">T</div>
        </div>
        <div class="task-tracks">
          <div class="track track-1"></div>
          <div class="track track-2"></div>
          <div class="track track-3"></div>
        </div>
        <div class="pulse-circle"></div>
        <div class="loading-text">Loading TaskFlow</div>
      </div>
    </div>
  `,
  styles: [
    `
    .loader-container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(30, 30, 30, 0.9); /* using --background-dark with opacity */
      z-index: 9999;
      backdrop-filter: blur(5px);
    }

    .taskflow-loader {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .logo-container {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, var(--custom-color), #ff6b6b);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(255, 59, 59, 0.3);
      margin-bottom: 30px;
      animation: float 3s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }

    .logo {
      color: var(--text-primary);
      font-size: 40px;
      font-weight: bold;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .task-tracks {
      position: absolute;
      width: 200px;
      height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }

    .track {
      height: 6px;
      border-radius: 3px;
      background: var(--border-color);
      position: relative;
      overflow: hidden;
    }

    .track::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(90deg, transparent, var(--primary), transparent);
      animation: trackMove 2s infinite;
    }

    .track-1 {
      width: 180px;
      animation-delay: 0s;
    }

    .track-2 {
      width: 140px;
      animation-delay: 0.2s;
    }

    .track-3 {
      width: 100px;
      animation-delay: 0.4s;
    }

    .track-1::after {
      animation-delay: 0s;
    }

    .track-2::after {
      animation-delay: 0.5s;
    }

    .track-3::after {
      animation-delay: 1s;
    }

    .pulse-circle {
      position: absolute;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: rgba(255, 59, 59, 0.1); /* using --custom-color with opacity */
      animation: pulse 2s infinite;
    }

    .loading-text {
      margin-top: 140px;
      font-size: 18px;
      font-weight: 500;
      color: var(--text-primary);
      letter-spacing: 1px;
      animation: fadeInOut 2s infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    @keyframes trackMove {
      0% {
        left: -100%;
      }
      100% {
        left: 200%;
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(0.8);
        opacity: 0.6;
      }
      50% {
        transform: scale(1);
        opacity: 0.3;
      }
      100% {
        transform: scale(0.8);
        opacity: 0.6;
      }
    }

    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .logo-container {
        width: 60px;
        height: 60px;
      }
      
      .logo {
        font-size: 30px;
      }
      
      .task-tracks {
        width: 150px;
        height: 150px;
      }
      
      .track-1 {
        width: 130px;
      }
      
      .track-2 {
        width: 100px;
      }
      
      .track-3 {
        width: 70px;
      }
      
      .pulse-circle {
        width: 150px;
        height: 150px;
      }
      
      .loading-text {
        margin-top: 100px;
        font-size: 16px;
      }
    }
  `,
  ],
})
export class FullSpinnerComponent {
  constructor() {}
}

