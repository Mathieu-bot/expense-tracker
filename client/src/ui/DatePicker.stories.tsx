import type { Meta, StoryObj } from "@storybook/react-vite";
import DatePicker, { type DatePickerProps } from "./DatePicker";
import React from "react";

const meta: Meta<DatePickerProps> = {
  title: "UI/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: { docs: { source: { type: "dynamic" } } },
  args: { value: null },
};

export default meta;
type Story = StoryObj<DatePickerProps>;

export const RequiredOptional: Story = {
  name: "Required vs Optional",
  render: () => {
    const [start, setStart] = React.useState<Date | null>(null);
    const [end, setEnd] = React.useState<Date | null>(null);
    return (
      <div className="p-4 grid gap-4 sm:grid-cols-2">
        <DatePicker
          value={start}
          onChange={setStart}
          label="Start date"
          required
          classes={{ input: "focus:ring-sky-500" }}
        />
        <DatePicker
          value={end}
          onChange={setEnd}
          label="End date"
          optional
          classes={{ input: "focus:ring-slate-500" }}
        />
      </div>
    );
  },
};

export const Sizes: Story = {
  name: "Sizes (small / medium / large)",
  render: () => {
    const [s, setS] = React.useState<Date | null>(null);
    const [m, setM] = React.useState<Date | null>(null);
    const [l, setL] = React.useState<Date | null>(null);
    return (
      <div className="p-4 grid gap-4">
        <div className="w-64">
          <DatePicker value={s} onChange={setS} label="Small" size="small" />
        </div>
        <div className="w-64">
          <DatePicker value={m} onChange={setM} label="Medium (default)" />
        </div>
        <div className="w-64">
          <DatePicker value={l} onChange={setL} label="Large" size="large" />
        </div>
      </div>
    );
  },
};

export const Colors: Story = {
  name: "Color palettes (via classes)",
  render: () => {
    const [v1, setV1] = React.useState<Date | null>(null);
    const [v2, setV2] = React.useState<Date | null>(null);
    const [v3, setV3] = React.useState<Date | null>(null);
    const [v4, setV4] = React.useState<Date | null>(null);
    return (
      <div className="p-4 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-2 text-sm text-emerald-700">Emerald</div>
          <DatePicker
            value={v1}
            onChange={setV1}
            label="Date (emerald)"
            classes={{
              input: "focus:ring-emerald-500",
              daySelected: "bg-emerald-600 text-white",
              nav: "text-emerald-700",
            }}
          />
        </div>
        <div>
          <div className="mb-2 text-sm text-rose-700">Rose</div>
          <DatePicker
            value={v2}
            onChange={setV2}
            label="Date (rose)"
            classes={{
              input: "focus:ring-rose-500",
              daySelected: "!bg-rose-600 !text-white",
              nav: "text-rose-700",
            }}
          />
        </div>
        <div>
          <div className="mb-2 text-sm text-amber-700">Amber</div>
          <DatePicker
            value={v3}
            onChange={setV3}
            label="Date (amber)"
            classes={{
              input: "focus:ring-amber-500",
              daySelected: "!bg-amber-500 !text-white",
              nav: "text-amber-700",
            }}
          />
        </div>
        <div>
          <div className="mb-2 text-sm text-sky-700">Sky</div>
          <DatePicker
            value={v4}
            onChange={setV4}
            label="Date (sky)"
            classes={{
              input: "focus:ring-sky-500",
              daySelected: "bg-sky-600 text-white",
              nav: "text-sky-700",
            }}
          />
        </div>
      </div>
    );
  },
};

export const Compact: Story = {
  name: "Compact width",
  render: (args) => {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <div className="p-4 space-y-4">
        <div className="w-40">
          <DatePicker {...args} value={value} onChange={setValue} />
        </div>
        <div className="w-56">
          <DatePicker {...args} value={value} onChange={setValue} />
        </div>
      </div>
    );
  },
};
