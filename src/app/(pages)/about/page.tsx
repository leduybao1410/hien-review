
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
                Hiển dành hàng giờ để nghiên cứu thông số kỹ thuật, mượn trải nghiệm sản phẩm từ các cửa hàng bán lẻ uy tín, nhằm mang đến cho người xem những thông tin hữu ích và góc nhìn độc đáo. Tại <strong>Hiển Review</strong>, bạn sẽ không chỉ tìm thấy những đánh giá chất lượng mà còn cảm nhận được câu chuyện đầy cảm hứng về sự vượt qua giới hạn để chinh phục đam mê công nghệ.
            </p>
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
