import ExpertIncomePanel from "./ExpertIncomePanel";
import { navigateToSubRoute } from "../../../utils/subRouteNavigation";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ExpertIncome() {
  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="pt-6 px-6">
        <Button
          variant="ghost"
          onClick={() => navigateToSubRoute("finance", "overview")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>
      <ExpertIncomePanel />
    </div>
  );
}


