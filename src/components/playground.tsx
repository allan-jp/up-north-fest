
import { h } from 'preact';
import { useState } from 'preact/hooks';

/**
 * Define control types for dynamic props
 */
export type Control =
  | {
      name: string;
      type: 'range';
      min: number;
      max: number;
      step?: number;
      defaultValue: number;
    }
  | {
      name: string;
      type: 'select';
      options: { label: string; value: string }[];
      defaultValue: string;
    }
  | {
      name: string;
      type: 'text';
      defaultValue: string;
    };

export interface PlaygroundProps {
  /** The component to render */
  component: any;
  /** Configuration for each control */
  controls: Control[];
}

export function Playground({ component: Component, controls }: PlaygroundProps) {
  // Initialize state from control defaults
  const initialProps = controls.reduce((acc, ctl) => {
    acc[ctl.name] = ctl.defaultValue;
    return acc;
  }, {} as Record<string, any>);

  const [props, setProps] = useState(initialProps);

  const handleChange = (name: string, value: any) => {
    setProps((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div class="p-6 bg-gray-50 rounded-lg shadow">
      {/* Controls panel */}
      <div class="space-y-4 mb-6">
        {controls.map((ctl) => {
          if (ctl.type === 'range') {
            return (
              <label class="flex items-center space-x-2" key={ctl.name}>
                <span class="w-24">{ctl.name}:</span>
                <input
                  type="range"
                  min={ctl.min}
                  max={ctl.max}
                  step={ctl.step || 1}
                  value={props[ctl.name]}
                  onInput={(e: any) => handleChange(ctl.name, +e.currentTarget.value)}
                  class="flex-1"
                />
                <span class="w-12 text-right">{props[ctl.name]}</span>
              </label>
            );
          }
          if (ctl.type === 'select') {
            return (
              <label class="flex items-center space-x-2" key={ctl.name}>
                <span class="w-24">{ctl.name}:</span>
                <select
                  value={props[ctl.name]}
                  onChange={(e: any) => handleChange(ctl.name, e.currentTarget.value)}
                  class="flex-1 border rounded"
                >
                  {ctl.options.map((opt) => (
                    <option value={opt.value} key={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            );
          }
          if (ctl.type === 'text') {
            return (
              <label class="flex items-center space-x-2" key={ctl.name}>
                <span class="w-24">{ctl.name}:</span>
                <input
                  type="text"
                  value={props[ctl.name]}
                  onInput={(e: any) => handleChange(ctl.name, e.currentTarget.value)}
                  class="flex-1 border rounded px-2 py-1"
                />
              </label>
            );
          }
          return null;
        })}
      </div>

      {/* Render the target component with dynamic props */}
      <div class="border border-gray-200 p-4 bg-white rounded">
        <Component {...props} />
      </div>
    </div>
  );
}
