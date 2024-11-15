// app/api/identify/analyze.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 类型定义
interface BreedResult {
  breed: string;
  percentage: number;
  confidence: number;
}

interface IdentifyRecord {
  id: string;
  user_id?: string;
  image_url: string;
  results: BreedResult[];
  description: string;
  created_at: string;
}

interface Post {
  id: string;
  user_id: string;
  identify_record_id: string;
  description: string;
  breed_tags: string[];
  topic_tags: string[];
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 获取当前用户
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;

    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ message: "请上传图片" }, { status: 400 });
    }

    // 验证文件类型
    if (!image.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "请上传有效的图片文件" },
        { status: 400 },
      );
    }

    // 生成安全的文件名
    const fileExt = image.name.split(".").pop();
    const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // 上传图片到 Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from("dog-images")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
      });

    if (storageError) {
      console.error("Storage error:", storageError);
      throw new Error("图片上传失败");
    }

    // 获取图片的公共URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("dog-images").getPublicUrl(storageData.path);

    // TODO: 调用实际的 AI API 进行识别
    const results: BreedResult[] = [
      { breed: "拉布拉多", percentage: 70, confidence: 0.9 },
      { breed: "金毛寻回犬", percentage: 30, confidence: 0.8 },
    ];

    // 获取识别出的主要犬种的特征描述
    const { data: breedData } = await supabase
      .from("breeds")
      .select("description, characteristics")
      .eq("name", results[0].breed)
      .single();

    // 生成更丰富的描述
    const description = breedData
      ? `这只狗狗主要展现出了${results[0].breed}的特征（${results[0].percentage}%），${breedData.description.slice(0, 100)}... 同时也包含${results[1].breed}的血统特征（${results[1].percentage}%）。`
      : `这只狗狗主要展现出了${results[0].breed}的特征（${results[0].percentage}%），同时也包含${results[1].breed}的血统特征（${results[1].percentage}%）。`;

    // 开启事务
    const { data: record, error: trxError } = await supabase.rpc(
      "create_identify_record_with_post",
      {
        p_image_url: publicUrl,
        p_results: results,
        p_description: description,
        p_user_id: user?.id,
        p_breed_tags: results.map((r) => r.breed),
        p_topic_tags: breedData?.characteristics || [],
      },
    );

    if (trxError) {
      console.error("Transaction error:", trxError);
      throw new Error("保存识别记录失败");
    }

    return NextResponse.json({
      success: true,
      data: {
        id: record.id,
        imageUrl: publicUrl,
        results: results,
        description: description,
        createdAt: record.created_at,
        userId: record.user_id,
      },
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "图片识别失败，请稍后重试";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
