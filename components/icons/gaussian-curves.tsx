import { createLucideIcon } from 'lucide-react';

export const GaussianCurve = createLucideIcon("GaussianCurve", [
    ["svg", { width: "100", height: "100", viewBox: "0 0 100 100", key: "svg1" }],
    ["path", { d: "M2 18 C 10 18, 14 4, 20 4 C 26 4, 30 18, 38 18", key: "curve1", stroke: "black", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }],
    ["line", { x1: "0", y1: "50", x2: "50", y2: "100", stroke: "black", strokeDasharray: "4,4", key: "median1" }]
    
]);

export const InvertedGaussianCurve = createLucideIcon("InvertedGaussianCurve", [
    ["svg", { width: "100", height: "100", viewBox: "0 0 100 100", key: "svg1" }],
    ["path", { d: "M2 6 C 10 6, 14 20, 20 20 C 26 20, 30 6, 38 6", key: "curve2", stroke: "black", strokeWidth: "2", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }]
]);

export const GaussianCurve1 = () => {
    return (
        <svg width="100" height="50">
        <path
          d = "M2 18 C 10 18, 14 4, 20 4 C 26 4, 30 18, 38 18"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    );
  }
  
  export const InvertedGaussianCurve1 = () =>{
    return (
     <svg width="100" height="50">
        <path
          d = "M2 6 C 10 6, 14 20, 20 20 C 26 20, 30 6, 38 6"
          fill="none"
          stroke="black"
          strokeWidth="2"
        />
      </svg>
    );
  }

  export const GaussianCurve2 = () => {
    return (
        <svg width="100" height="50" viewBox="0 0 100 100">
        <path
          d="M0 100 Q50 0 100 100 T200 100"
          fill="none"
          stroke="black"
          strokeWidth="5"
        />
      </svg>
    );
  }
  
  export const InvertedGaussianCurve2 = () =>{
    return (
     <svg width="100" height="50" viewBox="0 0 100 100">
        <path
          d="M0 0 Q50 100 100 0 T200 0"
          fill="none"
          stroke="black"
          strokeWidth="5"
        />
      </svg>
    );
  }