import { ChatBox } from "@/components/ChatBox"
import { Drawkit } from "@/components/DrawKit"
import { PlayerList } from "@/components/PlayerList"

export const GamePlay = () => {
    return (
        <div className="flex justify-between">
            <PlayerList width={18} />
            <Drawkit width={70}/>
            <ChatBox width={20} />
        </div>
    )
}
