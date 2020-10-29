import * as React from 'react'
import { Step, StepArray, Status } from './types'
import clsx from 'clsx'

export const StepGuide = ({
  steps,
  statuses,
}: {
  steps: StepArray
  statuses: Array<Status>
}) => {
  return (
    <div className="StepGuide">
      {steps.map((step, index) => (
        <StepComponent {...step} key={step.value} status={statuses[index]} />
      ))}
    </div>
  )
}

const StepComponent = (step: Step & any) => {
  return (
    <div className={clsx('Step', `Step-Status-${step.status}`)}>
      <div className="Step-Status">
        {step.status === Status.PROGRESS && <div>Loading</div>}
        {step.status === Status.INITIAL && ''}
        {step.status === Status.COMPLETE && '✅'}
        {step.status === Status.ERROR && '❌'}
      </div>
      <div className="Step-Info">
        <div className="Step-Title font-weight-bold">{step.label}</div>
        {step.description && (
          <div className="Step-Description">{step.description}</div>
        )}
      </div>
    </div>
  )
}
