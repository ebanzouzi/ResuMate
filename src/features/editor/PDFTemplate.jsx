// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";

// // Register accurate multi-weight standard Helvetica core fallbacks for bulletproof export sizing
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "row",
//     backgroundColor: "#FFFFFF",
//     fontFamily: "Helvetica",
//     fontSize: 10,
//     color: "#334155",
//     padding: 0,
//   },
//   // --- COLUMN SPLIT PARSING (Modern / Creative Models matching) ---
//   leftColumn: {
//     width: "35%",
//     backgroundColor: "#1E293B",
//     color: "#FFFFFF",
//     padding: 20,
//     height: "100%",
//   },
//   rightColumn: {
//     width: "65%",
//     padding: 25,
//     height: "100%",
//   },
//   // --- TYPOGRAPHY OBJECTIVE MATRIX ---
//   name: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     marginBottom: 2,
//     textTransform: "uppercase",
//   },
//   title: {
//     fontSize: 11,
//     color: "#38BDF8",
//     marginBottom: 12,
//     textTransform: "uppercase",
//     fontWeight: "bold",
//   },
//   contactItem: {
//     fontSize: 8,
//     color: "#94A3B8",
//     marginBottom: 4,
//   },
//   sectionTitleLeft: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#38BDF8",
//     borderBottomWidth: 1,
//     borderBottomColor: "#334155",
//     paddingBottom: 3,
//     marginTop: 18,
//     marginBottom: 8,
//     textTransform: "uppercase",
//   },
//   sectionTitleRight: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#0F172A",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//     paddingBottom: 3,
//     marginTop: 16,
//     marginBottom: 10,
//     textTransform: "uppercase",
//   },
//   textLeft: {
//     fontSize: 9,
//     color: "#CBD5E1",
//     leading: 1.4,
//   },
//   badgeSkill: {
//     backgroundColor: "#334155",
//     paddingHorizontal: 6,
//     paddingVertical: 3,
//     borderRadius: 4,
//     marginBottom: 4,
//     marginRight: 4,
//     fontSize: 8,
//     color: "#F8FAFC",
//   },
//   skillsWrapper: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 4,
//   },
//   // --- BLOCK ITEM STRUCTURE MATRICES ---
//   itemBlock: {
//     marginBottom: 12,
//   },
//   itemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 3,
//   },
//   boldCompany: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#1E293B",
//   },
//   italicRole: {
//     fontSize: 9,
//     fontStyle: "italic",
//     color: "#475569",
//     marginBottom: 2,
//   },
//   dateStamp: {
//     fontSize: 8,
//     color: "#94A3B8",
//   },
//   descriptionText: {
//     fontSize: 9,
//     color: "#475569",
//     lineHeight: 1.4,
//   },
// });

// export function MyCVDocument({ cvData }) {
//   return (
//     <Document
//       title={`CV_${cvData?.firstName || "Smart"}_${cvData?.lastName || "Africa"}`}
//     >
//       <Page size="A4" style={styles.page}>
//         {/* STRUCTURAL VECTOR LEFT COLUMN */}
//         <View style={styles.leftColumn}>
//           <Text style={styles.name}>{cvData?.firstName || "Prénom"}</Text>
//           <Text style={styles.name}>{cvData?.lastName || "Nom"}</Text>
//           <Text style={styles.title}>{cvData?.title || "Poste Ciblé"}</Text>

//           <View style={{ marginTop: 5, marginBottom: 10 }}>
//             <Text style={styles.contactItem}>
//               ✉️ {cvData?.email || "email@exemple.com"}
//             </Text>
//             <Text style={styles.contactItem}>
//               📞 {cvData?.phone || "+242 06 123 4567"}
//             </Text>
//           </View>

//           <Text style={styles.sectionTitleLeft}>Profil</Text>
//           <Text style={styles.textLeft}>
//             {cvData?.summary || "Aucun descriptif résumé défini."}
//           </Text>

//           <Text style={styles.sectionTitleLeft}>Compétences</Text>
//           <View style={styles.skillsWrapper}>
//             {cvData?.skills?.map((s, i) => (
//               <Text key={i} style={styles.badgeSkill}>
//                 {s}
//               </Text>
//             ))}
//           </View>

//           <Text style={styles.sectionTitleLeft}>Langues</Text>
//           <View style={{ gap: 4 }}>
//             {cvData?.languages?.map((l, i) => (
//               <Text key={i} style={[styles.textLeft, { fontSize: 8.5 }]}>
//                 • {l.name} : {l.level}
//               </Text>
//             ))}
//           </View>
//         </View>

//         {/* STRUCTURAL VECTOR RIGHT COLUMN */}
//         <View style={styles.rightColumn}>
//           <Text style={styles.sectionTitleRight}>
//             Expériences Professionnelles
//           </Text>
//           <View>
//             {cvData?.experiences?.length > 0 ? (
//               cvData.experiences.map((exp) => (
//                 <View key={exp.id} style={styles.itemBlock} wrap={false}>
//                   <View style={styles.itemHeader}>
//                     <Text style={styles.boldCompany}>
//                       {exp.company || "Entreprise"}
//                     </Text>
//                     <Text style={styles.dateStamp}>{exp.period}</Text>
//                   </View>
//                   <Text style={styles.italicRole}>
//                     {exp.role || "Poste occupé"}
//                   </Text>
//                   <Text style={styles.descriptionText}>{exp.description}</Text>
//                 </View>
//               ))
//             ) : (
//               <Text style={[styles.descriptionText, { fontStyle: "italic" }]}>
//                 Aucune expérience professionnelle listée.
//               </Text>
//             )}
//           </View>

//           <Text style={styles.sectionTitleRight}>Éducation & Formations</Text>
//           <View>
//             {cvData?.educations?.map((edu) => (
//               <View key={edu.id} style={styles.itemBlock} wrap={false}>
//                 <View style={styles.itemHeader}>
//                   <Text style={styles.boldCompany}>
//                     {edu.degree || "Intitulé du Diplôme"}
//                   </Text>
//                   <Text style={styles.dateStamp}>{edu.period}</Text>
//                 </View>
//                 <Text style={[styles.descriptionText, { color: "#64748B" }]}>
//                   {edu.school || "Université / Établissement"}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Définition centralisée des styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#334155",
    padding: 0,
  },
  // --- COLONNES SPLIT (MODERN / CREATIVE) ---
  leftColumnModern: {
    width: "35%",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    padding: 20,
    height: "100%",
  },
  leftColumnCreative: {
    width: "35%",
    backgroundColor: "#1E293B",
    color: "#FFFFFF",
    padding: 20,
    height: "100%",
    borderRightWidth: 3,
    borderRightColor: "#F59E0B",
  },
  rightColumnSplit: {
    width: "65%",
    padding: 25,
    height: "100%",
  },
  nameLight: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  titleModern: {
    fontSize: 10,
    color: "#38BDF8",
    marginTop: 4,
    marginBottom: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  titleCreative: {
    fontSize: 10,
    color: "#F59E0B",
    marginTop: 4,
    marginBottom: 15,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  contactItemLeft: {
    fontSize: 8,
    color: "#94A3B8",
    marginBottom: 4,
  },
  sectionTitleLeftModern: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#38BDF8",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 3,
    marginTop: 15,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  sectionTitleLeftCreative: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F59E0B",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 3,
    marginTop: 15,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  textLeft: {
    fontSize: 8.5,
    color: "#CBD5E1",
    lineHeight: 1.4,
  },
  badgeSkill: {
    backgroundColor: "#334155",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    marginBottom: 4,
    marginRight: 4,
    fontSize: 7.5,
    color: "#F8FAFC",
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  sectionTitleRight: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 3,
    marginTop: 15,
    marginBottom: 10,
    textTransform: "uppercase",
  },

  // --- STYLE MINIMAL ---
  pageMinimal: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1C1917",
    padding: 35,
  },
  headerMinimal: {
    borderBottomWidth: 1,
    borderBottomColor: "#D6D3D1",
    paddingBottom: 12,
    marginBottom: 15,
  },
  nameMinimal: {
    fontSize: 22,
    color: "#1C1917",
  },
  titleMinimal: {
    fontSize: 10,
    textTransform: "uppercase",
    color: "#78716C",
    marginTop: 2,
    fontWeight: "bold",
  },
  contactMinimal: {
    fontSize: 8.5,
    color: "#A8A29E",
    marginTop: 2,
  },
  gridRowMinimal: {
    flexDirection: "row",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E7E5E4",
    paddingTop: 10,
  },
  leftLabelMinimal: {
    width: "25%",
    fontSize: 9,
    fontWeight: "bold",
    color: "#78716C",
    textTransform: "uppercase",
  },
  rightContentMinimal: {
    width: "75%",
  },

  // --- STYLE ATS ---
  pageAts: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#000000",
    padding: 40,
  },
  headerAts: {
    textAlign: "center",
    borderBottomWidth: 1.5,
    borderBottomColor: "#000000",
    paddingBottom: 8,
    marginBottom: 15,
  },
  nameAts: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionTitleAts: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 2,
    marginTop: 15,
    marginBottom: 6,
  },

  // Blocs Communs
  itemBlock: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  boldText: {
    fontWeight: "bold",
    color: "#1E293B",
    fontSize: 9.5,
  },
  dateStamp: {
    fontSize: 8.5,
    color: "#94A3B8",
  },
  descriptionText: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.3,
  },
});

// SUB-RENDERERS
const ExperiencesList = ({ experiences, isAts = false }) => (
  <View>
    {experiences?.length > 0 ? (
      experiences.map((exp) => (
        <View key={exp.id} style={styles.itemBlock} wrap={false}>
          <View style={styles.itemHeader}>
            <Text style={styles.boldText}>
              {exp.role} {exp.company ? `@ ${exp.company}` : ""}
            </Text>
            <Text style={styles.dateStamp}>{exp.period}</Text>
          </View>
          <Text style={styles.descriptionText}>{exp.description}</Text>
        </View>
      ))
    ) : (
      <Text style={{ fontSize: 9, fontStyle: "italic" }}>
        Aucune expérience enregistrée.
      </Text>
    )}
  </View>
);

const EducationList = ({ educations }) => (
  <View>
    {educations?.map((edu) => (
      <View key={edu.id} style={styles.itemBlock} wrap={false}>
        <View style={styles.itemHeader}>
          <Text style={styles.boldText}>{edu.degree}</Text>
          <Text style={styles.dateStamp}>{edu.period}</Text>
        </View>
        <Text style={{ fontSize: 9, color: "#64748B" }}>{edu.school}</Text>
      </View>
    ))}
  </View>
);

export function MyCVDocument({ cvData, templateId, profileImage }) {
  if (!cvData) return null;

  // 1. MODERNE — Fidèle au preview : header sombre pleine largeur + 2 colonnes en dessous
  // Colonne gauche : Profil + Compétences + Langues
  // Colonne droite : Expériences + Formations
  if (templateId === "modern") {
    return (
      <Document title="CV_Moderne">
        <Page
          size="A4"
          style={{
            backgroundColor: "#FFFFFF",
            fontFamily: "Helvetica",
            fontSize: 10,
          }}
        >
          {/* HEADER PLEINE LARGEUR — gradient sombre + bordure indigo en bas */}
          <View
            style={{
              backgroundColor: "#0F172A",
              padding: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 4,
              borderBottomColor: "#6366F1",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {cvData.firstName || "Prénom"} {cvData.lastName || "Nom"}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#818CF8",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  marginTop: 3,
                }}
              >
                {cvData.title}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 6, gap: 16 }}>
                <Text style={{ fontSize: 8, color: "#94A3B8" }}>
                  ✉️ {cvData.email}
                </Text>
                <Text style={{ fontSize: 8, color: "#94A3B8" }}>
                  📞 {cvData.phone}
                </Text>
              </View>
            </View>
            {/* PHOTO DE PROFIL */}
            {profileImage && (
              <Image
                src={profileImage}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  border: "2px solid #6366F1",
                  marginLeft: 16,
                }}
              />
            )}
          </View>

          {/* BODY : 2 colonnes */}
          <View style={{ flexDirection: "row", flex: 1 }}>
            {/* COLONNE GAUCHE */}
            <View
              style={{
                width: "33%",
                backgroundColor: "#F8FAFC",
                padding: 18,
                borderRightWidth: 1,
                borderRightColor: "#E2E8F0",
              }}
            >
              <Text style={styles.sectionTitleLeftModern}>Profil</Text>
              <Text
                style={{ fontSize: 8.5, color: "#475569", lineHeight: 1.4 }}
              >
                {cvData.summary}
              </Text>

              <Text style={styles.sectionTitleLeftModern}>Compétences</Text>
              <View style={styles.skillsWrapper}>
                {cvData.skills?.map((s, i) => (
                  <Text
                    key={i}
                    style={{
                      backgroundColor: "#E0E7FF",
                      color: "#3730A3",
                      fontSize: 7.5,
                      paddingHorizontal: 5,
                      paddingVertical: 2,
                      borderRadius: 3,
                      marginBottom: 4,
                      marginRight: 4,
                    }}
                  >
                    {s}
                  </Text>
                ))}
              </View>

              {cvData.languages?.length > 0 && (
                <>
                  <Text style={styles.sectionTitleLeftModern}>Langues</Text>
                  {cvData.languages.map((l, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 3,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 8.5,
                          color: "#334155",
                          fontWeight: "bold",
                        }}
                      >
                        {l.name}
                      </Text>
                      <Text style={{ fontSize: 8, color: "#64748B" }}>
                        {l.level}
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>

            {/* COLONNE DROITE */}
            <View style={{ width: "67%", padding: 22 }}>
              <Text style={styles.sectionTitleRight}>
                Expériences Professionnelles
              </Text>
              <ExperiencesList experiences={cvData.experiences} />
              <Text style={styles.sectionTitleRight}>Études & Formations</Text>
              <EducationList educations={cvData.educations} />
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  // 2. CREATIVE — Colonne gauche sombre avec bordure ambre + photo ronde + résumé à droite
  if (templateId === "creative") {
    return (
      <Document title="CV_Creatif">
        <Page size="A4" style={styles.page}>
          {/* COLONNE GAUCHE SOMBRE */}
          <View style={styles.leftColumnCreative}>
            {/* PHOTO DE PROFIL */}
            {profileImage && (
              <Image
                src={profileImage}
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 10,
                  border: "2px solid #F59E0B",
                  marginBottom: 10,
                  alignSelf: "center",
                }}
              />
            )}
            <Text style={{ ...styles.nameLight, textAlign: "center" }}>
              {cvData.firstName}
            </Text>
            <Text style={{ ...styles.nameLight, textAlign: "center" }}>
              {cvData.lastName}
            </Text>
            <Text style={{ ...styles.titleCreative, textAlign: "center" }}>
              {cvData.title}
            </Text>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#334155",
                paddingTop: 10,
                marginTop: 4,
              }}
            >
              <Text style={styles.contactItemLeft}>✉️ {cvData.email}</Text>
              <Text style={styles.contactItemLeft}>📞 {cvData.phone}</Text>
            </View>

            <Text style={styles.sectionTitleLeftCreative}>Compétences</Text>
            <View style={{ gap: 3 }}>
              {cvData.skills?.map((s, i) => (
                <Text key={i} style={{ fontSize: 8, color: "#CBD5E1" }}>
                  • {s}
                </Text>
              ))}
            </View>

            {cvData.languages?.length > 0 && (
              <>
                <Text style={styles.sectionTitleLeftCreative}>Langues</Text>
                {cvData.languages.map((l, i) => (
                  <Text
                    key={i}
                    style={{ fontSize: 8, color: "#CBD5E1", marginBottom: 2 }}
                  >
                    {l.name} ({l.level})
                  </Text>
                ))}
              </>
            )}
          </View>

          {/* COLONNE DROITE */}
          <View
            style={{ ...styles.rightColumnSplit, backgroundColor: "#F8FAFC" }}
          >
            {/* RÉSUMÉ en bloc encadré */}
            <View
              style={{
                borderLeftWidth: 3,
                borderLeftColor: "#0F172A",
                paddingLeft: 10,
                marginBottom: 12,
                backgroundColor: "#FFFFFF",
                padding: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  color: "#475569",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                {cvData.summary}
              </Text>
            </View>

            <Text style={{ ...styles.sectionTitleRight, color: "#1E293B" }}>
              ● Expériences Professionnelles
            </Text>
            <ExperiencesList experiences={cvData.experiences} />

            <Text style={{ ...styles.sectionTitleRight, color: "#1E293B" }}>
              ● Éducation & Formations
            </Text>
            <EducationList educations={cvData.educations} />
          </View>
        </Page>
      </Document>
    );
  }

  // 3. MINIMAL
  if (templateId === "minimal") {
    return (
      <Document title="CV_Minimal">
        <Page size="A4" style={styles.pageMinimal}>
          <View
            style={{
              ...styles.headerMinimal,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.nameMinimal}>
                {cvData.firstName} {cvData.lastName}
              </Text>
              <Text style={styles.titleMinimal}>{cvData.title}</Text>
              <Text style={styles.contactMinimal}>
                {cvData.email} | {cvData.phone}
              </Text>
            </View>
            {/* PHOTO — en niveaux de gris (grayscale simulé via opacité) */}
            {profileImage && (
              <Image
                src={profileImage}
                style={{
                  width: 50,
                  height: 50,
                  border: "1px solid #D6D3D1",
                  marginLeft: 12,
                }}
              />
            )}
          </View>

          {cvData.summary ? (
            <Text
              style={{
                fontSize: 9,
                color: "#57534E",
                fontStyle: "italic",
                marginBottom: 10,
                lineHeight: 1.4,
              }}
            >
              {cvData.summary}
            </Text>
          ) : null}

          <View style={styles.gridRowMinimal}>
            <Text style={styles.leftLabelMinimal}>Expériences</Text>
            <View style={styles.rightContentMinimal}>
              <ExperiencesList experiences={cvData.experiences} />
            </View>
          </View>
          <View style={styles.gridRowMinimal}>
            <Text style={styles.leftLabelMinimal}>Éducation</Text>
            <View style={styles.rightContentMinimal}>
              <EducationList educations={cvData.educations} />
            </View>
          </View>
          {cvData.skills?.length > 0 && (
            <View style={styles.gridRowMinimal}>
              <Text style={styles.leftLabelMinimal}>Compétences</Text>
              <View
                style={{
                  ...styles.rightContentMinimal,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 4,
                }}
              >
                {cvData.skills.map((s, i) => (
                  <Text
                    key={i}
                    style={{
                      fontSize: 8.5,
                      color: "#1C1917",
                      borderWidth: 1,
                      borderColor: "#D6D3D1",
                      paddingHorizontal: 5,
                      paddingVertical: 1,
                    }}
                  >
                    {s}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </Page>
      </Document>
    );
  }

  // 4. ATS (Default fallback) — Pas de photo, 100% texte pour compatibilité ATS
  return (
    <Document title="CV_ATS">
      <Page size="A4" style={styles.pageAts}>
        <View style={styles.headerAts}>
          <Text style={styles.nameAts}>
            {cvData.firstName} {cvData.lastName}
          </Text>
          <Text style={{ ...styles.boldText, color: "#374151" }}>
            {cvData.title}
          </Text>
          <Text style={{ fontSize: 9, color: "#4B5563", marginTop: 2 }}>
            {cvData.email} | {cvData.phone}
          </Text>
        </View>
        {cvData.summary ? (
          <>
            <Text style={styles.sectionTitleAts}>Résumé Professionnel</Text>
            <Text
              style={{
                ...styles.descriptionText,
                color: "#1F2937",
                marginBottom: 4,
              }}
            >
              {cvData.summary}
            </Text>
          </>
        ) : null}
        <Text style={styles.sectionTitleAts}>Expériences Professionnelles</Text>
        <ExperiencesList experiences={cvData.experiences} isAts={true} />
        <Text style={styles.sectionTitleAts}>Éducation & Formations</Text>
        <EducationList educations={cvData.educations} />
        <Text style={styles.sectionTitleAts}>Compétences Techniques</Text>
        <Text style={styles.descriptionText}>{cvData.skills?.join(" | ")}</Text>
      </Page>
    </Document>
  );
}
