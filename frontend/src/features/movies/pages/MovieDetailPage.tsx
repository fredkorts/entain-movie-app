import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Row, Skeleton, Space, Tag, Typography, Avatar, List, Rate } from "antd";
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../lib/format";
import { translateJobTitle } from "../../../lib/jobTitleTranslations";
import { useGetMovieDetailQuery } from "../../../store/api/moviesApi";
import type { CastMember, CrewMember, Video, Review } from "../api/types";

const { Title, Text, Paragraph } = Typography;

const IMG = (p: string | null, w = 500) => (p ? `https://image.tmdb.org/t/p/w${w}${p}` : "");

const CastSection = ({ cast }: { cast: CastMember[] }) => {
  const { t } = useTranslation();
  
  const renderCastImage = (member: CastMember) => {
    if (member.profile_path) {
      return (
        <img
          alt={member.name}
          src={IMG(member.profile_path, 300)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            // Replace broken image with fallback avatar
            const target = e.currentTarget;
            const container = target.parentElement;
            if (container) {
              container.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; background-color: #fafafa;">
                  <div style="width: 80px; height: 80px; border-radius: 50%; background-color: #d9d9d9; display: flex; align-items: center; justify-content: center; color: #8c8c8c; font-size: 32px;">
                    👤
                  </div>
                </div>
              `;
            }
          }}
        />
      );
    }
    
    // No profile image available - show fallback avatar
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "#fafafa"
      }}>
        <Avatar 
          size={80} 
          icon={<UserOutlined />}
          style={{ backgroundColor: "#d9d9d9" }}
        />
      </div>
    );
  };
  
  return (
    <>
      <Title level={3}>{t("cast")}</Title>
      <Row gutter={[16, 16]}>
        {cast.slice(0, 8).map((member) => (
          <Col key={member.id} xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              cover={
                <div style={{ 
                  height: 200, 
                  overflow: "hidden", 
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {renderCastImage(member)}
                </div>
              }
              size="small"
            >
              <Card.Meta
                title={<Text strong style={{ fontSize: "12px" }}>{member.name}</Text>}
                description={<Text type="secondary" style={{ fontSize: "11px" }}>{member.character}</Text>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

const CrewSection = ({ crew }: { crew: CrewMember[] }) => {
  const { t, i18n } = useTranslation();
  
  // Group crew by department and show key roles
  const keyRoles = ["Director", "Producer", "Executive Producer", "Screenplay", "Story", "Writer"];
  const keyCrew = crew.filter(member => keyRoles.includes(member.job));
  
  return (
    <>
      <Title level={3}>{t("crew")}</Title>
      <Row gutter={[16, 8]}>
        {keyCrew.map((member) => (
          <Col key={`${member.id}-${member.job}`} span={12}>
            <Space>
              <Avatar 
                size={40} 
                src={IMG(member.profile_path, 150)} 
                icon={<UserOutlined />}
              />
              <div>
                <Text strong>{member.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {translateJobTitle(member.job, i18n.language)}
                </Text>
              </div>
            </Space>
          </Col>
        ))}
      </Row>
    </>
  );
};

const VideosSection = ({ videos }: { videos: Video[] }) => {
  const { t } = useTranslation();
  
  const trailers = videos.filter(v => v.type === "Trailer" && v.site === "YouTube");
  
  if (trailers.length === 0) return null;
  
  return (
    <>
      <Title level={3}>{t("videos")}</Title>
      <Row gutter={[16, 16]}>
        {trailers.slice(0, 3).map((video) => (
          <Col key={video.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div style={{ position: "relative", height: 180 }}>
                  <img
                    alt={video.name}
                    src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div 
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "48px",
                      color: "rgba(255, 255, 255, 0.8)"
                    }}
                  >
                    <PlayCircleOutlined />
                  </div>
                </div>
              }
              onClick={() => window.open(`https://www.youtube.com/watch?v=${video.key}`, "_blank")}
            >
              <Card.Meta title={video.name} />
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
  const { t } = useTranslation();
  
  if (reviews.length === 0) return null;
  
  return (
    <>
      <Title level={3}>{t("reviews")}</Title>
      <List
        itemLayout="vertical"
        dataSource={reviews}
        renderItem={(review) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={review.author}
              description={formatDate(review.created_at, "en")}
            />
            <Paragraph 
              ellipsis={{ rows: 3, expandable: true, symbol: t("read_more") || "Read more" }}
              style={{ marginTop: 8 }}
            >
              {review.content}
            </Paragraph>
          </List.Item>
        )}
      />
    </>
  );
};

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { data: movie, isLoading, error } = useGetMovieDetailQuery(
    { id: id!, lang: i18n.language },
    { skip: !id }
  );
  const navigate = useNavigate();

  if (isLoading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (error) return (
    <Alert 
      type="error" 
      message={t("error")} 
      description={typeof error === 'string' ? error : t("failed_to_load")} 
      showIcon 
    />
  );
  if (!movie) return <Alert type="warning" message={t("movie_not_found")} showIcon />;

  return (
    <main style={{ padding: "24px" }}>
      <Space style={{ marginBottom: 24 }}>
        <Button type="default" onClick={() => navigate(-1)}>
          {t("back")}
        </Button>
      </Space>

      {/* Hero Section with Backdrop */}
      <div 
        style={{
          backgroundImage: movie.backdrop_path ? `url(${IMG(movie.backdrop_path, 1280)})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: 12,
          position: "relative",
          marginBottom: 32
        }}
      >
        <div 
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)",
            padding: "40px",
            borderRadius: 12,
            color: "white"
          }}
        >
          <Row gutter={24} align="middle">
            <Col xs={24} md={6}>
              <img
                src={IMG(movie.poster_path, 500) || "/placeholder.svg"}
                alt={movie.title}
                style={{ width: "100%", borderRadius: 8, maxWidth: 300 }}
              />
            </Col>
            <Col xs={24} md={18}>
              <Title level={1} style={{ color: "white", marginBottom: 8 }}>
                {movie.title}
              </Title>
              {movie.tagline && (
                <Text style={{ fontSize: "16px", fontStyle: "italic", color: "rgba(255,255,255,0.8)" }}>
                  "{movie.tagline}"
                </Text>
              )}
              <div style={{ margin: "16px 0" }}>
                {movie.genres?.map((genre: { id: number; name: string }) => (
                  <Tag key={genre.id} color="blue" style={{ marginBottom: 4 }}>
                    {genre.name}
                  </Tag>
                ))}
              </div>
              <Row gutter={32} style={{ marginTop: 16 }}>
                <Col>
                  <Text strong style={{ color: "white" }}>{t("release")}:</Text>
                  <br />
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    {formatDate(movie.release_date, i18n.language)}
                  </Text>
                </Col>
                <Col>
                  <Text strong style={{ color: "white" }}>{t("runtime")}:</Text>
                  <br />
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    {movie.runtime ? `${movie.runtime} ${t("minutes")}` : "—"}
                  </Text>
                </Col>
                <Col>
                  <Text strong style={{ color: "white", textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                    {t("rating")}:
                  </Text>
                  <br />
                  <Rate disabled value={movie.vote_average / 2} style={{ fontSize: "14px" }} />
                  <Text style={{ color: "rgba(255,255,255,0.9)", marginLeft: 8, textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}>
                    {movie.vote_average?.toFixed(1) || "—"}
                  </Text>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      {/* Overview */}
      <Card style={{ marginBottom: 32 }}>
        <Title level={3}>{t("overview")}</Title>
        <Paragraph style={{ fontSize: "16px", lineHeight: 1.6 }}>
          {movie.overview || t("no_overview")}
        </Paragraph>
      </Card>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <CastSection cast={movie.cast} />
        </Card>
      )}

      {/* Crew */}
      {movie.crew && movie.crew.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <CrewSection crew={movie.crew} />
        </Card>
      )}

      {/* Videos */}
      {movie.videos && movie.videos.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <VideosSection videos={movie.videos} />
        </Card>
      )}

      {/* Reviews */}
      {movie.reviews && movie.reviews.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <ReviewsSection reviews={movie.reviews} />
        </Card>
      )}
    </main>
  );
}
