import { MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-[#E5DDD5]">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
        <div className="bg-[#075E54] p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
               <span className="text-2xl font-bold">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Aventus-Notch Help Center</h1>
              <p className="text-sm text-white/80">Our team typically replies in a few minutes</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 text-center bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
          <div className="max-w-md space-y-6 bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">Need immediate assistance?</h2>
            <p className="text-gray-600">
              Our support team is ready to help you with investments, account issues, or any other questions you may have.
            </p>

            <div className="flex flex-col gap-4">
              <Button
                onClick={() => (window as any).$crisp?.push(['do', 'chat:open'])}
                className="w-full h-16 bg-[#075E54] hover:bg-[#075E54]/90 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all"
              >
                <MessageSquare className="w-6 h-6" /> Start Live Chat
              </Button>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-500" /> Fast Response</span>
                <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-500" /> Encrypted</span>
              </div>
            </div>

            <div className="pt-4">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-[#075E54]">Account</h3>
                  <p className="text-xs text-gray-500">Login, security, and verification</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-[#075E54]">Investments</h3>
                  <p className="text-xs text-gray-500">Plans, assets, and dividends</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-[#075E54]">Payments</h3>
                  <p className="text-xs text-gray-500">Deposits and withdrawals</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-[#075E54]">General</h3>
                  <p className="text-xs text-gray-500">Other inquiries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
