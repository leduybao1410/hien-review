
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
        <div className="flex justify-center items-center mx-auto px-4 py-12 bg-[#f5f5f5]">
            <div className="container flex flex-col md:flex-row gap-4">
                <div className="lg:w-[70%] md:w-full flex flex-col gap-4 py-10 px-10 bg-white rounded-2xl shadow-xl">
                    <h1 className="md:text-3xl text-2xl font-bold text-center text-white bg-[var(--inverse-primary-color)] px-4 py-2 w-fit mx-auto rounded-lg">Về Hiển Review</h1>
                    <p className="text-lg leading-relaxed mb-4">
                        Chào mừng bạn đến với <strong>Hiển Review</strong>, nơi chia sẻ những đánh giá chân thực và chuyên sâu về các sản phẩm công nghệ như laptop và tai nghe. Đằng sau mỗi bài viết là sự đam mê và nỗ lực không ngừng của Hiển – một Youtuber khiếm thị với tình yêu mãnh liệt dành cho công nghệ.
                    </p>
                    <p className="text-lg leading-relaxed mb-5">
                        Hiển Review mang đến những bài đánh giá chuyên sâu về thiết bị công nghệ phục vụ công việc, bao gồm:
                    </p>
                    <ul className="list-inside md:list-horizontal list-vertical grid md:grid-cols-3 grid-cols-1 gap-4 text-lg leading-relaxed mb-5">
                        <li className="flex flex-col items-center justify-center">
                            <img src="/images/laptop-doanh-nghiep_1.jpg" alt="Laptop doanh nghiệp" className="w-[200px] h-[200px] object-contain mr-2" />
                            <b>Laptop doanh nghiệp</b>
                        </li>
                        <li className="flex flex-col items-center justify-center">
                            <img src="/images/Laptop Dell Precision 15 3581 i7.jpg" alt="Laptop workstation" className="w-[200px] h-[200px] object-contain mr-2" />
                            <b>Laptop workstation</b>
                        </li>
                        <li className="flex flex-col items-center justify-center">
                            <img src="/images/Laptop Asus ROG Zephyrus.jpg" alt="Ultrabook" className="w-[200px] h-[200px] object-contain mr-2" />
                            <b>Ultrabook</b>
                        </li>
                    </ul>
                    <p className="text-lg leading-relaxed mb-5">
                        Bên cạnh đó, chúng tôi chia sẻ nhiều mẹo và thủ thuật hữu ích giúp bạn tối ưu hiệu suất làm việc.
                    </p>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-4 border-b-2 border-[#777] w-fit md:mx-0 mx-auto">Sứ mệnh</h2>
                        <p className="text-lg leading-relaxed mb-4">
                            Hiển Review cam kết giải quyết ba vấn đề lớn mà người dùng thường gặp phải:
                        </p>
                        <ol className="list-decimal list-inside text-lg leading-relaxed mb-4">
                            <li>
                                Tránh mua nhầm hoặc sai sản phẩm: Giúp bạn lựa chọn đúng thiết bị, tiết kiệm chi phí và công sức.
                            </li>
                            <li>
                                Tìm máy bền bỉ, phù hợp doanh nghiệp: Gợi ý những sản phẩm có thể triển khai đồng loạt trong công ty, giúp tăng hiệu suất công việc, đạt được nhiều hợp đồng và cải thiện thu nhập cho toàn đội ngũ.
                            </li>
                            <li>
                                Xây dựng nền tảng kiến thức công nghệ cơ bản: Giúp người dùng nắm vững các kỹ năng sử dụng máy tính, tiết kiệm thời gian tìm hiểu khi công nghệ thay đổi.
                            </li>
                        </ol>
                        <h2 className="text-3xl font-bold mb-4 border-b-2 border-[#777] w-fit md:mx-0 mx-auto">Tầm nhìn</h2>
                        <p className="text-lg leading-relaxed">
                            Giai đoạn 2025-2030, Hiển Review phấn đấu trở thành địa chỉ tư vấn laptop đáng tin cậy nhất cho cả người dùng cá nhân và doanh nghiệp tại Việt Nam.
                        </p>
                    </div>
                    <div className="w-full flex flex-col items-center justify-start">
                        <div className="flex flex-col items-center justify-center">
                            <div className="mt-8">
                                <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Video mới nhất của Hiển Review</h2>
                                <div className="flex flex-col items-center rounded-2xl overflow-hidden shadow-2xl">
                                    <iframe className="md:w-[800px] md:h-[450px] w-[300px] h-[170px]" src={createIframeLink(latestVideo?.youtubeId ?? '')} title={latestVideo?.youtubeTitle ?? ''} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:w-[30%] md:w-full h-fit gap-4 py-10 px-10 bg-white rounded-2xl shadow-xl sticky top-[80px]">
                    <div className="w-full flex flex-col items-center justify-center">
                        <img src="/images/avatar.jpg" alt="Avatar Hiển Review" className="w-[300px] h-[300px] aspect-square object-cover rounded-full mb-2" />
                        <div className="flex flex-col items-center justify-center text-gray-800">
                            <p className="text-lg italic leading-relaxed text-center mb-5">"Hi vọng qua các bài đánh giá của kênh Hiển Review, các bạn sẽ dễ dàng tìm được thiết bị phù hợp với mục đích và nhu cầu phục vụ cho công việc của bản thân. "</p>
                            <p className="text-lg font-bold ">Tên đầy đủ: Hồ Thái Hiển - {new Date().getFullYear() - 1993} tuổi</p>
                            <p className="text-lg font-bold ">Kênh Youtube: <Link className="text-red-500" href="https://www.youtube.com/@Hien_review">Hiển Review</Link></p>
                            <p className="text-lg font-bold ">Facebook: <Link className="text-blue-500" href="https://www.facebook.com/HienReviewTechAudio">Hiển Review Fanpage</Link></p>
                            <p className="text-lg font-bold ">Gmail: <Link className="text-green-500" href="mailto:hienreviewer@gmail.com">hienreviewer@gmail.com</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
