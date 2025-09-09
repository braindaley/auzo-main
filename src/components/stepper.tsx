
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type StepperProps = {
  steps: { name: string }[];
  currentStep: number;
};

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-between w-full pt-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.name} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted ? "bg-primary text-primary-foreground" :
                  isActive ? "border-2 border-primary text-primary" : "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <p className={cn(
                  "text-xs mt-2 text-center",
                   isActive ? "font-semibold text-primary" : "text-muted-foreground"
                )}>
                {step.name}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    background: isCompleted
                      ? 'hsl(var(--primary))'
                      : 'hsl(var(--muted))'
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
