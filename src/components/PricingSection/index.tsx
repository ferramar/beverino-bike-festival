"use client"
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	Button,
	Chip,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	Stack,
} from '@mui/material';
import {
	DirectionsBike,
	DirectionsRun,
	Restaurant,
	CheckCircle,
	EuroSymbol,
	Groups,
	Timer,
	LocalDrink,
	CardGiftcard,
	Security,
} from '@mui/icons-material';
import Link from 'next/link';
import { isRegistrationOpen } from '../../utils/isRegistrationOpen';
import { motion } from 'framer-motion';

interface PricingCardProps {
	title: string;
	price: number;
	description: string;
	icon: React.ReactNode;
	features: string[];
	color: string;
	popular?: boolean;
	optional?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
	title,
	price,
	description,
	icon,
	features,
	color,
	popular = false,
	optional = false,
}) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			style={{ height: '100%' }}
		>
			<Card
				elevation={popular ? 8 : 2}
				sx={{
					height: '100%',
					position: 'relative',
					border: popular ? '2px solid' : '1px solid',
					borderColor: popular ? color : 'divider',
					transition: 'all 0.3s ease',
					overflow: 'visible',
					'&:hover': {
						transform: 'translateY(-8px)',
						boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
						borderColor: color,
					},
				}}
			>
				{popular && (
					<Chip
						label="PIÙ POPOLARE"
						size="small"
						sx={{
							position: 'absolute',
							top: -12,
							left: '50%',
							transform: 'translateX(-50%)',
							backgroundColor: color,
							color: 'white',
							fontWeight: 700,
							fontSize: '0.75rem',
							letterSpacing: 0.5,
							px: 2,
						}}
					/>
				)}

				{optional && (
					<Chip
						label="OPZIONALE"
						size="small"
						variant="outlined"
						sx={{
							position: 'absolute',
							top: 12,
							right: 12,
							borderColor: color,
							color: color,
							fontWeight: 600,
						}}
					/>
				)}

				<CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
					{/* Icona */}
					<Box
						sx={{
							width: 80,
							height: 80,
							borderRadius: '50%',
							backgroundColor: `${color}15`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							mx: 'auto',
							mb: 3,
						}}
					>
						<Box sx={{ color: color, display: 'flex' }}>{icon}</Box>
					</Box>

					{/* Titolo */}
					<Typography
						variant="h5"
						component="h3"
						textAlign="center"
						gutterBottom
						fontWeight={700}
					>
						{title}
					</Typography>

					{/* Descrizione */}
					<Typography
						variant="body2"
						color="text.secondary"
						textAlign="center"
						sx={{ mb: 3 }}
					>
						{description}
					</Typography>

					{/* Prezzo */}
					<Box sx={{ textAlign: 'center', mb: 3 }}>
						<Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center' }}>
							<Typography variant="h3" fontWeight={800} sx={{ color: color }}>
								€{price}
							</Typography>
							{optional && (
								<Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
									/persona
								</Typography>
							)}
						</Box>
					</Box>

					<Divider sx={{ mb: 3 }} />

					{/* Features */}
					<List dense sx={{ flexGrow: 1 }}>
						{features.map((feature, index) => (
							<ListItem key={index} disableGutters>
								<ListItemIcon sx={{ minWidth: 32 }}>
									<CheckCircle fontSize="small" sx={{ color: color }} />
								</ListItemIcon>
								<ListItemText
									primary={feature}
									primaryTypographyProps={{
										variant: 'body2',
										color: 'text.secondary',
									}}
								/>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default function PricingSection() {
	const pricingData = [
		{
			title: 'Raduno Running',
			price: 10,
			description: 'Perfetto per chi ama correre tra i sentieri della Val di Vara',
			icon: <DirectionsRun sx={{ fontSize: 40 }} />,
			features: [
				'Percorso podistico segnalato',
				'Pettorale',
				'Ristori lungo il percorso',
				'Assistenza medica',
			],
			color: '#4CAF50',
			popular: false,
		},
		{
			title: 'Raduno Ciclistico',
			price: 25,
			description: 'L\'esperienza completa per gli amanti del ciclismo',
			icon: <DirectionsBike sx={{ fontSize: 40 }} />,
			features: [
				'3 percorsi: 30km, 35km, 40km',
				'Pettorale',
				'Ristori lungo il percorso',
				'Assistenza meccanica',
				'Assistenza medica'
			],
			color: '#A52D0C',
			popular: true,
		},
		{
			title: 'Pasta Party',
			price: 12,
			description: 'Festeggia con noi dopo la gara con prodotti locali',
			icon: <Restaurant sx={{ fontSize: 40 }} />,
			features: [
				'Pasta con sughi tradizionali',
				'Bevande incluse',
				'Dolce della casa',
				'Prodotti tipici locali',
				'Musica dal vivo',
				'Area relax con tavoli',
			],
			color: '#FF9800',
			popular: false,
			optional: true,
		},
	];

	return (
		<Box
			sx={{
				py: 10,
				backgroundColor: 'background.default',
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					height: '100%',
					background: 'linear-gradient(180deg, rgba(165,45,12,0.03) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
			}}
		>
			<Container maxWidth="lg">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<Box sx={{ textAlign: 'center', mb: 8 }}>
						<Typography
							variant="h2"
							component="h2"
							gutterBottom
							sx={{
								fontWeight: 800,
								fontSize: { xs: '2.5rem', md: '3.5rem' },
								background: 'linear-gradient(135deg, #A52D0C 0%, #FB6616 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								color: 'transparent',
								mb: 2,
							}}
						>
							Tariffe e Iscrizioni
						</Typography>
						<Typography
							variant="h5"
							color="text.secondary"
							sx={{ maxWidth: 700, mx: 'auto', mb: 4 }}
						>
							Scegli la formula più adatta a te e unisciti a noi per questa straordinaria avventura
						</Typography>

                        {/* Info box */}
						<Box
							sx={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: 3,
								p: 2,
								borderRadius: 2,
                                backgroundColor: isRegistrationOpen() ? 'success.lighter' : 'error.lighter',
								border: '1px solid',
                                borderColor: isRegistrationOpen() ? 'success.light' : 'error.light',
							}}
						>
							<Stack direction="row" spacing={1} alignItems="center">
                                <Timer color={isRegistrationOpen() ? 'warning' : 'error'} />
								<Typography variant="body1">
                                    {isRegistrationOpen() ? 'Iscrizioni aperte fino al 20 settembre ore 22' : 'Iscrizioni chiuse - Iscrizione sul posto il 21 settembre'}
								</Typography>
							</Stack>
						</Box>
					</Box>
				</motion.div>

				{/* Pricing Cards */}
				<Grid container spacing={4} alignItems="stretch">
					{pricingData.map((item, index) => (
						<Grid size={{ xs: 12, md: 4 }} key={index}>
							<PricingCard {...item} />
						</Grid>
					))}
				</Grid>

				{/* Cosa è incluso */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Box
						sx={{
							mt: 8,
							p: 4,
							borderRadius: 3,
							background: 'linear-gradient(135deg, #f5f5f5 0%, #fafafa 100%)',
							border: '1px solid',
							borderColor: 'divider',
						}}
					>
						<Typography
							variant="h5"
							textAlign="center"
							gutterBottom
							fontWeight={700}
							sx={{ mb: 4 }}
						>
							Cosa è incluso
						</Typography>

						<Grid container spacing={3}>
							{[
								{
									icon: <Security />,
									title: 'Assicurazione',
									description: 'Copertura assicurativa completa per tutti i partecipanti',
								},
								{
									icon: <LocalDrink />,
									title: 'Ristori',
									description: 'Punti di ristoro con acqua, sali minerali e snack energetici',
								},
								{
									icon: <CardGiftcard />,
									title: 'Pacco Gara (fino ad esaurimento)',
									description: 'Regalo di benvenuto con gadget e prodotti locali',
								}
							].map((item, index) => (
								<Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
									<Box sx={{ textAlign: 'center' }}>
										<Box
											sx={{
												color: 'primary.main',
												mb: 2,
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											{item.icon}
										</Box>
										<Typography variant="h6" gutterBottom fontWeight={600}>
											{item.title}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{item.description}
										</Typography>
									</Box>
								</Grid>
							))}
						</Grid>
					</Box>
				</motion.div>
			</Container>
		</Box>
	);
}