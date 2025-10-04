import { CheckCircle2, CircleDot, Circle } from 'lucide-react';

const steps = ['Employee', 'Manager', 'Finance'];

const ApprovalStatusTracker = ({ currentStep }) => {
  return (
    <div className="w-full px-2 mt-2">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepIndex = index + 1;
          const isCompleted = stepIndex < currentStep;
          const isCurrent = stepIndex === currentStep;
          const isUpcoming = stepIndex > currentStep;

          return (
            <div key={step} className="flex items-center w-full">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-200' : ''}
                    ${isUpcoming ? 'bg-gray-200 text-gray-500' : ''}
                  `}
                >
                  {isCompleted ? <CheckCircle2 size={20} /> : isCurrent ? <CircleDot size={20} /> : <Circle size={20} />}
                </div>
                <p className={`text-xs mt-1 ${isCurrent ? 'font-bold text-indigo-700' : 'text-gray-500'}`}>{step}</p>
              </div>

              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 ${isCompleted || isCurrent ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApprovalStatusTracker;