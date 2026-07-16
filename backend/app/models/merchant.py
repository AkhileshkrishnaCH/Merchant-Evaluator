"""SQLAlchemy models and database setup."""

from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, Float, DateTime, create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.config.settings import get_settings


class Base(DeclarativeBase):
    pass


class MerchantEvaluation(Base):
    """Stores merchant health evaluations."""

    __tablename__ = "merchant_evaluations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_name = Column(String, nullable=False)
    revenue_growth = Column(Float, nullable=False)
    transaction_trend = Column(Float, nullable=False)
    average_order_value = Column(Float, nullable=False)
    customer_review_trend = Column(Float, nullable=False)
    repeat_purchase_rate = Column(Float, nullable=False)
    login_frequency = Column(Float, nullable=False)
    days_since_last_activity = Column(Float, nullable=False)
    feature_adoption_score = Column(Float, nullable=False)
    support_sentiment = Column(Float, nullable=False)
    renewal_history = Column(Float, nullable=False)
    refund_rate = Column(Float, nullable=False)
    delivery_failure_rate = Column(Float, nullable=False)
    health_score = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# Database engine and session
settings = get_settings()
engine = create_async_engine(settings.DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def create_tables():
    """Create all database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db():
    """Dependency for getting a database session."""
    async with async_session() as session:
        yield session
