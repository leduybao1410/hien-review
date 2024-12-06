
import { checkIsUpdatedToday, createIframeLink, fetchLatestVideo, readYoutubeData } from "@/app/utils/youtube_utils";
import Link from "next/link";


export default async function AboutPage() {
    const isUpdatedToday = await checkIsUpdatedToday();
    let latestVideo: any;
    if (!isUpdatedToday) {
        latestVideo = await fetchLatestVideo();
        console.log('Fetch latest video:', latestVideo);
    } else {
        latestVideo = await readYoutubeData();
        console.log('Already updated today:', latestVideo);
    }
    return (
        <div className="container mx-auto px-4 py-12 bg-white rounded-lg shadow-xl my-12">
            <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">Về Hiển Review</h1>
            <p className="text-lg leading-relaxed mb-4">
                Chào mừng bạn đến với <strong>Hiển Review</strong>, nơi chia sẻ những đánh giá chân thực và chuyên sâu về các sản phẩm công nghệ như laptop và tai nghe. Đằng sau mỗi bài viết là sự đam mê và nỗ lực không ngừng của Hiển – một Youtuber khiếm thị với tình yêu mãnh liệt dành cho công nghệ.
            </p>
            <p className="text-lg leading-relaxed mb-5">
                Hiển Review mang đến những bài đánh giá chuyên sâu về thiết bị công nghệ phục vụ công việc, bao gồm:
            </p>
            <ul className="list-disc list-inside text-lg leading-relaxed mb-5">
                <li>Laptop doanh nghiệp</li>
                <li>Laptop workstation</li>
                <li>Ultrabook văn phòng nhỏ gọn, ultrabook hiệu năng cao</li>
            </ul>
            <p className="text-lg leading-relaxed mb-5">
                Bên cạnh đó, chúng tôi chia sẻ nhiều mẹo và thủ thuật hữu ích giúp bạn tối ưu hiệu suất làm việc.
            </p>
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Sứ mệnh</h2>
                <p className="text-lg leading-relaxed mb-4">
                    Hiển Review cam kết giải quyết ba vấn đề lớn mà người dùng thường gặp phải:
                </p>
                <ol className="list-decimal list-inside text-lg leading-relaxed mb-4">
                    <li>
                        <strong>Tránh mua nhầm hoặc sai sản phẩm:</strong> Giúp bạn lựa chọn đúng thiết bị, tiết kiệm chi phí và công sức.
                    </li>
                    <li>
                        <strong>Tìm máy bền bỉ, phù hợp doanh nghiệp:</strong> Gợi ý những sản phẩm có thể triển khai đồng loạt trong công ty, giúp tăng hiệu suất công việc, đạt được nhiều hợp đồng và cải thiện thu nhập cho toàn đội ngũ.
                    </li>
                    <li>
                        <strong>Xây dựng nền tảng kiến thức công nghệ cơ bản:</strong> Giúp người dùng nắm vững các kỹ năng sử dụng máy tính, tiết kiệm thời gian tìm hiểu khi công nghệ thay đổi.
                    </li>
                </ol>
                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Tầm nhìn</h2>
                <p className="text-lg leading-relaxed">
                    Giai đoạn 2025-2030, Hiển Review phấn đấu trở thành địa chỉ tư vấn laptop đáng tin cậy nhất cho cả người dùng cá nhân và doanh nghiệp tại Việt Nam.
                </p>
            </div>
            <div className="flex lg:flex-row flex-col gap-4">
                <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
                    <img src="/images/avatar.jpg" alt="Avatar Hiển Review" className="w-[300px] h-[300px] aspect-square object-cover rounded-full mb-2" />
                    <div >
                        <p className="text-lg italic leading-relaxed text-center mb-5">"Hi vọng qua các bài đánh giá của kênh Hiển Review, các bạn sẽ dễ dàng tìm được thiết bị phù hợp với mục đích và nhu cầu phục vụ cho công việc của bản thân. "</p>
                        <p className="text-lg font-bold text-gray-800">Tên đầy đủ: Hồ Thái Hiển - {new Date().getFullYear() - 1993} tuổi</p>
                        <p className="text-lg font-bold text-gray-800">Kênh Youtube: <Link className="text-blue-500" href="https://www.youtube.com/@Hien_review">Hiển Review</Link></p>

                    </div>
                </div>
                <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <div className="mt-8">
                            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Video mới nhất</h2>
                            <div className="flex flex-col items-center">
                                <iframe width="500" height="315" src={createIframeLink(latestVideo?.youtubeId ?? '')} title={latestVideo?.youtubeTitle ?? ''} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
