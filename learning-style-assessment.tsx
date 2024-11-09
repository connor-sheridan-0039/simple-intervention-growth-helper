import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const LearningStyleAssessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [scores, setScores] = useState({
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0
  });
  const [answers, setAnswers] = useState({});
  const [quizComplete, setQuizComplete] = useState(false);

  const learningStyles = [
    {
      type: 'visual',
      content: {
        material: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visual Learning Example</h3>
            <div className="bg-blue-100 p-4 rounded-lg">
              <svg viewBox="0 0 200 100" className="w-full h-40">
                <circle cx="50" cy="50" r="40" fill="#4299E1"/>
                <rect x="110" y="10" width="80" height="80" fill="#48BB78"/>
              </svg>
            </div>
            <p className="text-sm">
              The image above shows two basic geometric shapes: a blue circle on the left and a green square on the right.
              Pay attention to their positions and colors.
            </p>
          </div>
        ),
        question: "Describe the geometric shapes shown in the image, including their colors and relative positions.",
        correctAnswer: "A blue circle on the left and a green square on the right",
        maxScore: 4
      }
    },
    {
      type: 'auditory',
      content: {
        material: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Auditory Learning Example</h3>
            <p className="text-sm">
              Listen carefully to this verbal description (simulated):
              "The process of photosynthesis involves six carbon dioxide molecules
              and six water molecules combining to form one glucose molecule and
              six oxygen molecules, powered by sunlight energy."
            </p>
          </div>
        ),
        question: "Explain the chemical equation described in the verbal description of photosynthesis.",
        correctAnswer: "6 CO2 + 6 H2O → C6H12O6 + 6 O2",
        maxScore: 4
      }
    },
    {
      type: 'reading',
      content: {
        material: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reading/Writing Learning Example</h3>
            <p className="text-sm">
              The water cycle, also known as the hydrologic cycle, is the continuous
              movement of water on, above, and below the surface of the Earth.
              Water changes between liquid, vapor, and ice at various points in the
              cycle. The process includes evaporation, condensation, precipitation,
              and collection.
            </p>
          </div>
        ),
        question: "List and briefly explain the four main stages of the water cycle mentioned in the text.",
        correctAnswer: "Evaporation, condensation, precipitation, and collection",
        maxScore: 4
      }
    },
    {
      type: 'kinesthetic',
      content: {
        material: (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kinesthetic Learning Example</h3>
            <p className="text-sm">
              Interactive Exercise: Use your hands to demonstrate the rotation of
              the Earth around the Sun. Make a fist for the Sun, and use your
              other hand to show how the Earth orbits while spinning on its axis.
              Practice this motion for 30 seconds.
            </p>
          </div>
        ),
        question: "Describe how you demonstrated the Earth's rotation and revolution around the Sun using your hands.",
        correctAnswer: "One hand as Sun, other hand orbiting while spinning",
        maxScore: 4
      }
    }
  ];

  const handleNextStep = () => {
    if (showQuestion) {
      if (currentStep < learningStyles.length - 1) {
        setCurrentStep(currentStep + 1);
        setShowQuestion(false);
      } else {
        setQuizComplete(true);
      }
    } else {
      setShowQuestion(true);
    }
  };

  const handleAnswerSubmit = (answer) => {
    const currentStyle = learningStyles[currentStep].type;
    // Simple scoring logic - could be made more sophisticated
    const score = Math.min(4, answer.length / 20); // Simple scoring based on answer length
    setScores(prev => ({
      ...prev,
      [currentStyle]: prev[currentStyle] + score
    }));
    setAnswers(prev => ({
      ...prev,
      [currentStep]: answer
    }));
  };

  const getDominantStyle = () => {
    const maxScore = Math.max(...Object.values(scores));
    return Object.entries(scores).find(([_, score]) => score === maxScore)?.[0];
  };

  const getScoreData = () => {
    return Object.entries(scores).map(([style, score]) => ({
      name: style.charAt(0).toUpperCase() + style.slice(1),
      score: score
    }));
  };

  if (quizComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Learning Style Assessment Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-green-100 rounded-lg">
            <h3 className="text-xl font-bold">
              Your Dominant Learning Style: {getDominantStyle()?.toUpperCase()}
            </h3>
          </div>
          <div className="h-64">
            <BarChart width={600} height={250} data={getScoreData()} className="mx-auto">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#4299E1" />
            </BarChart>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Learning Style Assessment</CardTitle>
        <Progress value={(currentStep / learningStyles.length) * 100} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        {!showQuestion ? (
          <div className="space-y-4">
            {learningStyles[currentStep].content.material}
            <Button 
              onClick={() => setShowQuestion(true)}
              className="w-full mt-4"
            >
              Show Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold">Question:</h3>
            <p>{learningStyles[currentStep].content.question}</p>
            <textarea
              className="w-full h-32 p-2 border rounded"
              placeholder="Type your answer here..."
              onChange={(e) => handleAnswerSubmit(e.target.value)}
            />
            <Button 
              onClick={handleNextStep}
              className="w-full"
            >
              {currentStep < learningStyles.length - 1 ? 'Next' : 'Complete Assessment'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningStyleAssessment;
