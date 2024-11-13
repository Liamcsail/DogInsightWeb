import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        关于 DogInsight
      </h1>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">我们的使命</h2>
          <p className="text-lg text-gray-700 mb-4">
            DogInsight 致力于帮助狗狗主人更好地了解和照顾他们的宠物。通过先进的
            AI
            技术，我们提供准确的犬种识别和个性化的护理建议，让每一只狗狗都能获得最适合它的关爱。
          </p>
          <p className="text-lg text-gray-700">
            我们相信，了解是爱的基础。让我们一起，更了解你的狗狗，更好地爱它！
          </p>
        </div>
        <div className="relative h-64 md:h-full">
          <Image
            src="/about-hero.jpg"
            alt="Happy dog with owner"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">热爱狗狗</h3>
            <p className="text-gray-600">
              我们是一群狗狗爱好者，致力于为每只狗狗提供最好的关怀。
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Image
              src="/ai-icon.svg"
              alt="AI Technology"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">AI 技术</h3>
            <p className="text-gray-600">
              运用先进的人工智能技术，为您提供准确的犬种识别和个性化建议。
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Image
              src="/community-icon.svg"
              alt="Dog Lover Community"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">狗狗社区</h3>
            <p className="text-gray-600">
              加入我们的社区，与其他狗狗爱好者分享经验，获取专业建议。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-center">我们的团队</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "李明", role: "创始人 & CEO", image: "/team/founder.jpg" },
            { name: "王芳", role: "AI 工程师", image: "/team/ai-engineer.jpg" },
            {
              name: "张伟",
              role: "产品经理",
              image: "/team/product-manager.jpg",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
        <p className="text-lg text-gray-700 mb-4">
          有任何问题或建议？我们随时欢迎您的反馈！
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="flex items-center">
            <Mail className="mr-2 h-4 w-4" /> 发送邮件
          </Button>
          <Button variant="outline" className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" /> 查看地址
          </Button>
        </div>
      </div>
    </div>
  );
}
