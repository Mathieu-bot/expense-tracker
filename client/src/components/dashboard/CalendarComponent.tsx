import { Calendar } from "react-calendar";
import Layout from "./Layout";
export default function CalendarComponent() {
  return (
    <Layout graphClassName="h-[300px]">
      <Calendar
        value={new Date()}
        className="text-white flex items-center justify-center flex-col"
        showNeighboringMonth={false}
        showFixedNumberOfWeeks={false}
      />
    </Layout>
  );
}
