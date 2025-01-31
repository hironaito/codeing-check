import Image from "next/image";
import { SampleChart } from '@/components/ui/SampleChart';

export default function Home() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">人口推移グラフ</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <SampleChart />
      </div>
    </main>
  );
}
