export type UniqueIdentifier = string | number;

export type Nameable = {
  id: UniqueIdentifier;
  name: string;
};

export type AssigneeNameable = {
  id: string;
  firstName: string;
  lastName: string;
};

export type MeasureUnitPair = {
  measureId: number;
  measureName: string;
  unitId: number;
  unitName: string;
  formulaFromStandard: string;
};

export function isDefined<Value>(
  value: Value | undefined | null,
): value is Value {
  return value !== null && value !== undefined;
}
