// src/HealthRisks.jsx
import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; 

const RiskIndicator = ({ risk, percentage }) => (
  <div className="flex items-center mb-6">
    <div className="w-24 h-24 mr-4">
      <CircularProgressbar value={percentage} text={`${percentage}%`} />
    </div>
    <p className="text-lg font-semibold">{risk}</p>
  </div>
);

const HealthRisks = () => {
  const [risks, setRisks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const healthData = [
    { glucose: 150, bloodPressure: 135, cholesterol: 260 },
    { glucose: 130, bloodPressure: 120, cholesterol: 240 },
    { glucose: 170, bloodPressure: 145, cholesterol: 280 },
    { glucose: 160, bloodPressure: 130, cholesterol: 220 },
    { glucose: 180, bloodPressure: 140, cholesterol: 300 },
  ];

  useEffect(() => {
    assessHealthRisks();
  }, []);

  const assessHealthRisks = () => {
    const allRisks = {};

    healthData.forEach(item => {
      const { glucose, bloodPressure, cholesterol } = item;

      if (glucose > 140) {
        const glucoseRisk = Math.min((glucose - 140) / 20 * 100, 100);
        if (!allRisks['Risk of Diabetes'] || glucoseRisk > allRisks['Risk of Diabetes']) {
          allRisks['Risk of Diabetes'] = glucoseRisk.toFixed(1);
        }
      }
      if (bloodPressure > 130) {
        const bloodPressureRisk = Math.min((bloodPressure - 130) / 20 * 100, 100);
        if (!allRisks['Risk of Hypertension'] || bloodPressureRisk > allRisks['Risk of Hypertension']) {
          allRisks['Risk of Hypertension'] = bloodPressureRisk.toFixed(1);
        }
      }
      if (cholesterol > 240) {
        const cholesterolRisk = Math.min((cholesterol - 240) / 40 * 100, 100);
        if (!allRisks['Risk of High Cholesterol'] || cholesterolRisk > allRisks['Risk of High Cholesterol']) {
          allRisks['Risk of High Cholesterol'] = cholesterolRisk.toFixed(1);
        }
      }
    });

    setRisks(Object.entries(allRisks).map(([name, percentage]) => ({ name, percentage })));
    setRecommendations(getRecommendations(Object.keys(allRisks)));
  };

  const getRecommendations = (risks) => {
    const recommendations = {
      'Risk of Diabetes': [
        'Maintain a balanced diet with low sugar intake.',
        'Engage in regular physical activity (at least 150 minutes of moderate exercise weekly).',
        'Monitor blood glucose levels regularly.',
      ],
      'Risk of Hypertension': [
        'Reduce salt intake in your diet.',
        'Maintain a healthy weight through diet and exercise.',
        'Limit alcohol consumption and avoid smoking.',
      ],
      'Risk of High Cholesterol': [
        'Eat more fruits, vegetables, and whole grains.',
        'Reduce saturated and trans fat intake.',
        'Include healthy fats like olive oil and omega-3 fatty acids in your diet.',
      ],
    };

    return risks.map(risk => ({
      risk,
      details: recommendations[risk] || ['No recommendations available.'],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Health Risks Assessment</h1>
      {risks.length > 0 ? (
        risks.map((risk, index) => (
          <RiskIndicator key={index} risk={risk.name} percentage={risk.percentage} />
        ))
      ) : (
        <p>No significant health risks detected.</p>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        {recommendations.length > 0 ? (
          recommendations.map((recommendation, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-medium">{recommendation.risk}</h3>
              <ul className="list-disc pl-5">
                {recommendation.details.map((detail, idx) => (
                  <li key={idx} className="mb-1">{detail}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default HealthRisks;
