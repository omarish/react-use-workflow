import React from 'react'
import { replaceAt } from 'timm'
import {
  Step,
  Status,
  StepArray,
  Workflow,
  GetContextFunction,
  ExecuteFunction,
} from './types'

export const useWorkflow = ({
  steps,
  getContext,
  guardArray = [],
}: Workflow) => {
  /**
   * Main entry point to execute a workflow.
   *
   * @param {{steps}} the sequence of Step objects to execute.
   * @param {{getContext}} lets you specify the execution context for a function
   * @param {{guardArray}} gets passed as the last argument to React.useEffect
   */
  const [statuses, setStatuses] = React.useState<Array<Status>>([])

  React.useEffect(() => {
    const execute = async () => {
      for (let i = 0; i < steps.length; i++) {
        setStatuses(oldStatuses => [...oldStatuses, Status.PROGRESS])
        try {
          const executionContext = getContext
            ? await getContext({ stepNumber: i })
            : {}
          await steps[i].func(executionContext)
          setStatuses(oldStatuses => replaceAt(oldStatuses, i, Status.COMPLETE))
        } catch (exc) {
          console.warn('Error: ', exc)
          setStatuses(oldStatuses => replaceAt(oldStatuses, i, Status.ERROR))
          break
        }
      }
    }

    execute()
      .then(() => {
        return statuses
      })
      .catch(err => {
        console.info('error')
        throw err
      })
  }, guardArray)

  return {
    statuses,
  }
}

export const makeWorkflow = ({
  steps,
  getContext = undefined,
  guardArray = undefined,
}: {
  steps: StepArray
  getContext?: GetContextFunction
  guardArray?: Array<any>
}): Workflow => {
  /**
   * Helper function to create the proper workflow data structure.
   */
  return {
    steps: steps.map(makeStep),
    getContext: typeof getContext === 'function' ? getContext : () => {},
    guardArray: guardArray || [],
  }
}

export const makeStep = ({
  label,
  value,
  ...data
}: { label: string; func: ExecuteFunction } & Partial<Step>) => ({
  label,
  value: value || label.replace(' ', '_').toUpperCase(),
  status: Status.INITIAL,
  ...data,
})
