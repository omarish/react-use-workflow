export enum Status {
  INITIAL = 'Initial',
  PROGRESS = 'Progress',
  ERROR = 'Error',
  COMPLETE = 'Complete',
}

export type GetContextFunction = ({ stepNumber }: { stepNumber: number }) => any

export type StepArray = Array<Step>

export type Workflow = {
  steps: StepArray
  getContext?: GetContextFunction
  guardArray?: Array<any>
}

export type ExecuteFunction = (context?: any) => any | Promise<any>
// export type VerifyFunction = (context?: any) => boolean | Promise<boolean>

export type Step = {
  label: string
  description?: string
  value?: string
  status: Status
  func: ExecuteFunction
  // verify?: VerifyFunction
}
